export default class ExamMethodsUtil {
  static standardizedDataReview = async (questionStore: any) => {
    // Nếu là câu hỏi
    questionStore.forEach((question: any) => {
      question.listQuestions.forEach(element => {
        switch (element.typeId) {
          // câu hỏi 2 lựa chọn
          case 1:
          case 3:
            element.answers.forEach(answer => {
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
            element.answers.forEach(answer => {
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
            element.answers.forEach(answer => {
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
      console.log(childQuestionLog)

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
      console.log(questionId, logData)

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
      console.log(element)

      const answerLog = questionLog.answers.find((x: any) => x.answerId === element.id)
      console.log('answerLog', answerLog)

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
            const answer = questionLog.answers.find(x => x.answeredValue === answerLog.answeredValue && x.answerId !== answerLog.answerId)
            if (answer)
              element.answeredValue = answer.answerId
          }
          else if (element.isTrue === true && answerLog.answeredValue !== null) {
            // vế phải
            const answer = question.answers.find(x => x.position === Number(answerLog.answeredValue) && x.answerId !== answerLog.answerId)
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
    console.log(question)
  }

  // lấy dữ liệu đã lưu trong local
  static formatDataFromLocal(element: any, questionItem: any) {
    const questionLocal = questionItem.questions.find(
      x => x.id === element.questionId,
    )

    if (questionLocal && questionLocal !== null) {
      switch (element.typeId) {
      // câu hỏi 1 lựa chọn
        case 1:
        case 3:
          console.log(questionLocal)
          if (questionLocal.value !== null) {
            console.log(questionLocal.value)
            const answer = element.answers.find(
              (x: any) => x.id === questionLocal.value,
            )
            if (answer)
              answer.answeredValue = true
            console.log(answer)
          }
          break
        case 4:
          if (element.answers.length > 0)
            element.answers[0].answeredValue = questionLocal.value

          break

        // câu hỏi nhiều lựa chọn
        case 2:
        case 5:
        case 6:
        case 7:
          if (questionLocal.answers && questionLocal.answers !== null) {
            element.answers.forEach(answer => {
              const answerLocal = questionLocal.answers.find(
                x => x.id === answer.answerId,
              )
              if (answerLocal)
                answer.answeredValue = answerLocal.value
            })
          }
          break

        // câu hỏi ghép đôi
        case 8:
          if (questionLocal.answers !== null) {
            questionLocal?.answers?.forEach(answerLocal => {
              if (answerLocal && answerLocal.right !== null) {
                const answer = element.answers.find(
                  x => x.answerId === answerLocal.right,
                )
                if (answer) {
                  answer.position = answerLocal.position
                  answer.answeredValue = answerLocal.position
                  answer.isMatched = answerLocal.isMatched
                }
              }
              if (answerLocal && answerLocal.left !== null) {
                const answer = element.answers.find(
                  x => x.answerId === answerLocal.left,
                )
                if (answer && answerLocal.right && answerLocal.isMatched)
                  answer.answeredValue = answerLocal.right
              }
            })
          }
          break
        case 9:
          if (element.answers.length > 0) {
            element.answers[0].essayContent = questionLocal?.essayContent || null
            element.answers[0].urlFile = questionLocal?.urlFile || null
          }
          break
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
          element.questions.forEach(question => {
            //
          })
        }
      }
    })
  }

  // lấy dữ liệu để lưu vào local
  static getLocalDataFromQuestion(question: any) {
    const questions: any = []
    const localData = {
      id: question.id,
      isMark: question.isMark,
      questions: [],
      isAnswered: question.isAnswered,
    }
    if (!question.isGroup) {
      if (!question.isAnswered)
        question.isAnswered = false
      questions.push(this.changeDataSaveLocal(question))
    }
    localData.questions = questions
    return localData
  }

  // xử lỹ dữ liệu câu hỏi để lưu
  static changeDataSaveLocal(element: any) {
    if (!element.isAnswered)
      element.isAnswered = false
    const questionData: any = {
      id: element.questionId,
      value: null,
      isDataChange: false,
    }

    switch (element.typeId) {
    // câu hỏi 2 lựa chọn
      case 1:
      case 3:
        console.log(element.answers)
        element.answers.forEach((answer: any) => {
          console.log(answer?.answeredValue)
          if (answer?.answeredValue) {
            answer.answeredValue = true
            questionData.value = answer.id
            questionData.isAnswered = true
            element.isAnswered = true
          }
        })
        break

        // case 4:
        //   element.answers.forEach((answer: any) => {
        //     if (answer.answeredValue === 1) {
        //       answer.answeredValue = true
        //       questionData.value = true
        //     }
        //     else if (answer.answeredValue === 0) {
        //       answer.answeredValue = false
        //       questionData.value = false
        //     }
        //   })
        //   break
        // case 2:
        // case 5:
        //   questionData.answers = []
        //   element.answers.forEach((answer: any) => {
        //     if (answer.answeredValue === 1)
        //       answer.answeredValue = true

        //     if (answer.answeredValue === 0)
        //       answer.answeredValue = false

        //     questionData.answers.push({
        //       id: answer.answerId,
        //       value: answer.answeredValue,
        //     })
        //   })
        //   break
        // case 6:
        // case 7:
        //   questionData.answers = []
        //   element.answers.forEach((answer: any) => {
        //     questionData.answers.push({
        //       id: answer.answerId,
        //       value: answer.answeredValue,
        //     })
        //   })
        //   break

      //   // lưu danh sách vế trái câu hỏi điền khuyết
      // case 8:
      //   questionData.answers = []
      //   // eslint-disable-next-line no-case-declarations
      //   const rights: any = element.answers.filter((x: any) => x.isTrue)
      //   // eslint-disable-next-line no-case-declarations
      //   const lefts: any = element.answers.filter((x: any) => !x.isTrue)
      //   for (let i = 0; i < lefts.length; i += 1) {
      //     const left = lefts.find(x => x.position === i + 1)
      //     const right = rights.find(x => x.answeredValue === i + 1)
      //     if (left && right) {
      //       const answer = {
      //         left: left.answerId,
      //         right: right.answerId,
      //         isMatched: left.answeredValue === right.answerId,
      //         position: i + 1,
      //       }
      //       questionData.answers.push(answer)
      //     }
      //   }
      //   break
      // case 9:
      //   element.answers.forEach((answer: any) => {
      //     questionData.essayContent = answer.essayContent
      //     questionData.urlFile = answer.urlFile
      //   })
      //   break
      default:
        break
    }
    console.log(questionData)

    return questionData
  }
}
