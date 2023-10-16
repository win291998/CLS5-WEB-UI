/* eslint-disable no-case-declarations */
export default class ExamMethodsUtil {
  static standardizedDataReview = async (questionStore: any) => {
    // Nếu là câu hỏi
    questionStore.forEach((question: any) => {
      question.listQuestions.forEach((element: any) => {
        switch (element.typeId) {
          // câu hỏi 2 lựa chọn
          case 1:
          case 3:
            element.answers.forEach((answer: any) => {
              if (answer.answeredValue === 1)
                answer.answeredValue = true
              if (answer.answerValue === 1)
                answer.answerValue = true
              else answer.answerValue = false
            })

            break
          case 4:
          case 2:
          case 5:
            element.answers.forEach((answer: any) => {
              if (answer.answeredValue === 1)
                answer.answeredValue = true

              else if (answer.answeredValue === 0)
                answer.answeredValue = false
              else answer.answeredValue = null
              if (answer.answerValue === 1)
                answer.answerValue = true
              else answer.answerValue = false
            })
            break
          case 8:
            element.answers.forEach((answer: any) => {
              if (answer.isTrue === false && answer.answeredValue !== null) {
                const answerMatch = element.answers.find(x => x.isTrue === true && x.answeredValue === answer.answeredValue)
                if (answerMatch)
                  answer.answeredValue = answerMatch.answerId
              }
            })
            break
          default:
            break
        }
      })
    })
  }

  // đồng bộ dữ liệu từ log
  static synchronizedFromLog(questionStore: any, logData: any) {
    // lấy danh sách dữ liệu log theo log gần nhất
    questionStore.forEach((element: any) => {
      // nếu là câu hỏi chùm
      // if (element.isGroup) {
      //   const question = this.findQuestionFromLog(element.id, logData)
      //   if (question !== null)
      //     element.isMark = question.isMark

      //   element.questions.forEach((childQuestion: any) => {
      //     const childQuestionLog = this.findQuestionFromLog(childQuestion.id, logData)
      //     if (childQuestionLog)
      //       this.synchronizedFromQuestionLog(childQuestion, childQuestionLog)
      //   })
      //   element.isAnswered = element.listQuestions.find((x: any) => x.isAnswered) !== undefined
      // }
      // else {
      const childQuestionLog = this.findQuestionFromLog(element.id, logData)
      console.log('childQuestionLog', element, logData, childQuestionLog)

      if (childQuestionLog) {
        this.synchronizedFromQuestionLog(element, childQuestionLog)
        element.isMark = childQuestionLog.isMark
      }

    //   }
    })
  }

  // tìm kiếm question trong log
  static findQuestionFromLog(questionId: number, logData: any) {
    let questionData
    for (let i = 0; i < logData.length; i += 1) {
      const log = logData[i]

      for (let index = 0; index < log.questions.length; index += 1) {
        const question = log.questions[index]
        if (question.questionId === questionId)
          questionData = question
      }
    }
    return questionData || null
  }

  // đồng bộ dữ liệu câu hỏi
  static synchronizedFromQuestionLog(question: any, questionLog: any) {
    question.answers.forEach((element: any) => {
      const answerLog = questionLog.answers.find((x: any) => x.answerId === element.id)

      if (answerLog) {
        if (question.typeId === 1) {
          element.answeredValue = answerLog.answeredValue ? true : null
        }

        // câu hỏi tự luận

        else if (question.typeId === 9) {
          element.essayContent = answerLog.essayContent
          element.urlFile = answerLog.urlFile
        }
        else if (question.typeId === 8) {
          if (element.isTrue === false && answerLog.answeredValue !== null) {
            // vế trái
            const answer = questionLog.answers.find((x: any) => x.answeredValue === answerLog.answeredValue && x.answerId !== answerLog.answerId)
            if (answer)
              element.answeredValue = answer.answerId
          }
          else if (element.isTrue === true && answerLog.answeredValue !== null) {
            // vế phải
            const answer = question.answers.find((x: any) => x.position === Number(answerLog.answeredValue) && x.answerId !== answerLog.answerId)
            if (answer)
              element.answeredValue = answer.position
          }
        }

        else if (answerLog.answeredValue !== null) {
          element.answeredValue = answerLog.answeredValue
        }
        else { element.answeredValue = null }
      }
    })
    if (question.typeId === 9) {
      question.isAnswered = questionLog.answers.find((x: any) => x.urlFile || (x.essayContent !== null && x.essayContent?.length > 0)) !== undefined
    }
    else if (question.typeId === 8) {
      const answered = question.answers.find((x: any) => x.isTrue === false && x.answeredValue !== null)
      question.isAnswered = !!answered
    }
    else {
      question.isAnswered = question.answers.find((x: any) => x.answeredValue !== null) !== undefined
    }
  }

  // lấy dữ liệu đã lưu trong local
  static formatDataFromLocal(element: any, questionItem: any) {
    if (questionItem && questionItem.answers?.length) {
      switch (element.typeId) {
        case 1: // câu hỏi 1 lựa chọn
        case 3: // câu hỏi  gạch chân
        case 4: // câu hỏi  gạch chân
          const answer = element.answers.find(
            (x: any) => x.id === questionItem.answers[0],
          )
          if (answer)
            answer.answeredValue = true
          break

          // câu hỏi nhiều lựa chọn
        case 2:
        case 7:
          element.answers.forEach((asw: any) => {
            asw.answeredValue = questionItem.answers.includes(asw.id)
          })
          break
        case 5:
          element.answers.forEach((asw: any) => {
            asw.answeredValue = questionItem.answers.findIndex((item: any) => item === asw.id) % 2 === 0
          })
          break
        case 6:

          element.answers.forEach((asw: any) => {
            const position = questionItem.answers.findIndex((item: any) => item === asw.id)
            asw.answeredValue = position >= 0 ? position + 1 : null
            asw.isTrue = position >= 0
          })
          break

        // câu hỏi ghép đôi
        case 8:
          console.log(element, questionItem)

          const pos = 0
          element.answers.forEach((asw: any) => {
            // for (let i = 0; i < array.length; i++) {
            //   const element = array[i];

            // }
            const position = questionItem.answers.findIndex((item: any) => item === asw.id)
            console.log(position)

            // asw.answeredValue = position >= 0 ? position + 1 : null
            // asw.isTrue = position >= 0
          })

          // if (questionLocal.answers !== null) {
          //   questionLocal?.answers?.forEach((answerLocal: any) => {
          //     if (answerLocal && answerLocal.right !== null) {
          //       const answer = element.answers.find(
          //         (x: any) => x.answerId === answerLocal.right,
          //       )
          //       if (answer) {
          //         answer.position = answerLocal.position
          //         answer.answeredValue = answerLocal.position
          //         answer.isMatched = answerLocal.isMatched
          //       }
          //     }
          //     if (answerLocal && answerLocal.left !== null) {
          //       const answer = element.answers.find(
          //         (x: any) => x.answerId === answerLocal.left,
          //       )
          //       if (answer && answerLocal.right && answerLocal.isMatched)
          //         answer.answeredValue = answerLocal.right
          //     }
          //   })
          // }
          break

        // case 9:
        //   if (element.answers.length > 0) {
        //     element.answers[0].essayContent = questionLocal?.essayContent || null
        //     element.answers[0].urlFile = questionLocal?.urlFile || null
        //   }
        //   break
        default:
          break
      }
    }
  }

  static getDataFromDataLocal(questionStore: any, localData: any) {
    // lưu local storage
    questionStore.forEach((element: any) => {
      let questionItem: any = null
      if (!element.isAnswered)
        element.isAnswered = false
      questionItem = localData.find((x: any) => x.id === element.id)

      if (questionItem) {
        element.isMark = questionItem.isMark
        element.isAnswered = questionItem.isAnswered

        // nếu là câu hỏi đơn
        if (!element.isGroup) {
          this.formatDataFromLocal(element, questionItem)
        }
        else {
          element.questions.forEach((question: any) => {
            // this.formatDataFromLocal(question, questionItem)
          })
        }
      }
    })
  }

  // lấy dữ liệu để lưu vào local
  static getLocalDataFromQuestion(question: any, isMark?: boolean) {
    let questions: any = null
    const localData = {
      id: question.id,
      isMark,
      answers: null as any,
      isAnswered: question.isAnswered,
    }
    if (!question.isGroup) {
      question.isAnswered = !!question.isAnswered
      questions = this.changeDataSaveLocal(question)
    }

    localData.answers = questions
    return localData
  }

  // xử lỹ dữ liệu câu hỏi để lưu
  static changeDataSaveLocal(element: any) {
    if (!element.isAnswered)
      element.isAnswered = false
    let answerData: any = null

    switch (element.typeId) {
      case 1: // câu hỏi 1 lựa chọn
      case 3: // câu hỏi gạch chân
      case 4: // câu hỏi  đúng sai
      case 6: // câu hỏi  điền khuyết
      case 7: // câu hỏi  điền khuyết 2
        element.answers.forEach((answer: any) => {
          if (answer?.answeredValue) {
            if (answerData === null)
              answerData = []
            answer.answeredValue = true
            answerData.push(answer.id)
          }
        })
        break

      case 2:
        element.answers.forEach((answer: any) => {
          if (answer.answeredValue === true) {
            answer.answeredValue = true
            if (answerData === null)
              answerData = []
            answerData.push(answer.id)
          }
        })
        break
      case 5:
        let posTrue = 0
        let posFalse = 1

        element.answers.forEach((answer: any) => {
          if (answer.answeredValue !== null) {
            if (answerData === null)
              answerData = []
            if (answer.answeredValue) {
              answerData[posTrue] = answer.id
              posTrue += 2
            }
            else {
              answerData[posFalse] = answer.id
              posFalse += 2
            }
          }
        })

        for (let index = 0; index < answerData?.length; index++) {
          if (answerData[index] === undefined)
            answerData[index] = 0
        }
        break

      case 8:
        console.log(element)
        let posFalseMatch = 0
        let posTrueMatch = 1
        for (let i = 0; i < element.answers.length; i += 1) {
          if (element.answers[i]?.matched) {
            if (answerData === null)
              answerData = []
            answerData[posTrueMatch] = element.answers[i].id
            answerData[posFalseMatch] = element.answers[i + 1].id
            i++
            posTrueMatch += 2
            posFalseMatch += 2
          }
        }

        // questionData.answers = []
        // // eslint-disable-next-line no-case-declarations
        // const rights: any = element.answers.filter((x: any) => x.isTrue)
        // // eslint-disable-next-line no-case-declarations
        // const lefts: any = element.answers.filter((x: any) => !x.isTrue)
        // for (let i = 0; i < lefts.length; i += 1) {
        //   const left = lefts.find(x => x.position === i + 1)
        //   const right = rights.find(x => x.answeredValue === i + 1)
        //   if (left && right) {
        //     const answer = {
        //       left: left.answerId,
        //       right: right.answerId,
        //       isMatched: left.answeredValue === right.answerId,
        //       position: i + 1,
        //     }
        //     questionData.answers.push(answer)
        //   }
        // }
        break

      // case 9:
      //   element.answers.forEach((answer: any) => {
      //     questionData.essayContent = answer.essayContent
      //     questionData.urlFile = answer.urlFile
      //   })
      //   break
      default:
        break
    }
    console.log('answerData', answerData)

    return answerData
  }

  static saveLocalData(element: any, localData: any) {
    // console.log(element, localData)
    if (!element.isGroup) {
      const localDataPos = localData.find((item: any) => item.id === element.id)
      localDataPos.answers = this.changeDataSaveLocal(element)
      console.log(localDataPos.answers)
    }
  }

  static getExamUserAnswerChange(questionStore: any, localStorageData: any) {
    // console.log('localStorageData', localStorageData)
    // console.log('questionStore', questionStore)

    const model = {
      listData: [] as any[],
    }

    // tìm những câu hỏi có dữ liệu thay đổi ở local storage
    const listIdQuestionChange: any[] = []
    if (localStorageData?.questions?.length) {
      localStorageData?.questions?.forEach((el: any) => {
        el?.questions?.forEach((q: any) => {
          if (q?.isDataChange === true && q?.id)
            listIdQuestionChange.push(q.id)
        })
      })
    }
    questionStore.forEach((element: any) => {
      // chỉ lấy những câu hỏi có sự thay đổi đáp án
      if (element.isDataChange === true || element.listQuestions?.find((x: any) => x.isDataChange === true)
      || (listIdQuestionChange.length && element.listQuestions.find((x: any) => listIdQuestionChange.includes(x.questionId)))) {
        let questionData = null

        questionData = {
          questionId: element.id,
          isMark: element.isMark,
          answers: [],
        }

        // nếu là câu hỏi chùm
        // if (element.isQuestionGroup === true) {
        //   element.listQuestions.forEach((question: any) => {
        //     if (question?.isDataChange === true || listIdQuestionChange.includes(question.questionId)) {
        //       model.listData.push({
        //         questionId: question.questionId,
        //         answers: this.getListUserAnswer(question),
        //       })
        //     }
        //   })
        // }
        // else
        if (element)
          questionData.answers = this.getListUserAnswer(element)

        model.listData.push(questionData)
        element.isDataChange = false
      }
    })
    console.log('model', model)
    return model
  }

  // lấy danh sách câu trả lời của người dùng
  static getListUserAnswer(question: any) {
    let listAnswer: any = null
    switch (question.typeId) {
      case 1:
      case 2:
      case 3:
      case 6:
      case 7:

        question.answers.forEach((element: any) => {
          if (element.answeredValue) {
            if (listAnswer === null)
              listAnswer = []
            listAnswer.push(element.id)
          }
        })
        break

      case 4:
        const answered = question.answers.find((x: any) => x.answeredValue === true)
        if (answered?.id) {
          if (listAnswer === null)
            listAnswer = []
          if (answered?.position === 1)
            listAnswer.push(answered.id)
        }

        break

      case 5:
        let posTrue = 0
        let posFalse = 1
        question.answers.forEach((element: any) => {
          if (element.answeredValue || element.answeredValue === 0) {
            if (listAnswer === null)
              listAnswer = []
            if (element.answeredValue) {
              listAnswer[posTrue] = element.id
              posTrue += 2
            }
            else {
              listAnswer[posFalse] = element.id
              posFalse += 2
            }
          }
        })
        for (let index = 0; index < listAnswer?.length; index++) {
          if (listAnswer[index] === undefined)
            listAnswer[index] = 0
        }

        break
      case 8:
        let posFalseMatch = 0
        let posTrueMatch = 1
        for (let i = 0; i < question.answers.length; i += 1) {
          if (question.answers[i]?.matched) {
            if (listAnswer === null)
              listAnswer = []
            listAnswer[posTrueMatch] = question.answers[i].id
            listAnswer[posFalseMatch] = question.answers[i + 1].id
            i++
            posTrueMatch += 2
            posFalseMatch += 2
          }
        }

        break

      case 9:
        if (question.answers[0].answeredValue) {
          listAnswer = {
            answer: question.answers[0].answeredValue,
            urlFile: question.answers[0].urlFile,
          }
        }

        break
      default:

        break
    }
    console.log('listAnswer', listAnswer)

    return listAnswer
  }

  // lấy đáp án của người dùng
  static getFormatAnwerUser(element: any) {
    let questionData: any = null
    questionData = {
      id: element.id,
      answers: [],
      ...(element.isMark ? { isMark: element.isMark } : {}),
    }

    if (element.typeId !== 9) {
      questionData.answers = this.getListUserAnswer(element)
    }

    else {
      questionData.answer = this.getListUserAnswer(element)?.answer
      questionData.answers = null
      questionData.urlFile = this.getListUserAnswer(element)?.urlFile
    }
    return questionData
  }

  static getExamUserAnswer(questionStore: any) {
    const model: any = {
      listData: [],
    }
    questionStore.forEach((element: any) => {
      // nếu là câu hỏi chùm
      if (element.isGroup === true) {
        const listData: any = []
        element.questions.forEach((question: any) => {
          const qsFormat = this.getFormatAnwerUser(question)
          if (qsFormat.answers !== null || qsFormat.answer)
            listData.push(qsFormat)
        })
        if (listData?.length) {
          model.listData.push({
            id: element.id,
            isMark: element.isMark,
            listAnswer: listData,
          })
        }
      }
      else {
        const qsFormat = this.getFormatAnwerUser(element)
        if (qsFormat.answers !== null || qsFormat.answer)
          model.listData.push(qsFormat)
      }
    })
    return model
  }
}
