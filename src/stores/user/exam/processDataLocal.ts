/* eslint-disable no-case-declarations */
export default {
  // lấy dữ liệu lưu local storage
  changeDataSaveLocal(element: any) {
    if (!element.isAnswered)
      element.isAnswered = false
    const questionData: any = {
      id: element.questionId,
      value: null,
      isDataChange: false,
    }
    switch (element.questionTypeId) {
    // câu hỏi 2 lựa chọn
      case 1:
      case 3:
        element.answers.forEach(answer => {
          if (answer.answeredValue === 1) {
            answer.answeredValue = true
            questionData.value = answer.answerId
            questionData.isAnswered = true
            element.isAnswered = true
          }
        })
        break
      case 4:
        element.answers.forEach(answer => {
          if (answer.answeredValue === 1) {
            answer.answeredValue = true
            questionData.value = true
          }
          else if (answer.answeredValue === 0) {
            answer.answeredValue = false
            questionData.value = false
          }
        })
        break
      case 2:
      case 5:
        questionData.answers = []
        element.answers.forEach(answer => {
          if (answer.answeredValue === 1)
            answer.answeredValue = true

          if (answer.answeredValue === 0)
            answer.answeredValue = false

          questionData.answers.push({
            id: answer.answerId,
            value: answer.answeredValue,
          })
        })
        break
      case 6:
      case 7:
        questionData.answers = []
        element.answers.forEach(answer => {
          questionData.answers.push({
            id: answer.answerId,
            value: answer.answeredValue,
          })
        })
        break

        // lưu danh sách vế trái câu hỏi điền khuyết
      case 8:
        questionData.answers = []
        const rights = element.answers.filter(x => x.isTrue === true)
        const lefts = element.answers.filter(x => x.isTrue === false)
        for (let i = 0; i < lefts.length; i += 1) {
          const left = lefts.find(x => x.position === i + 1)
          const right = rights.find(x => x.answeredValue === i + 1)
          if (left && right) {
            const answer = {
              left: left.answerId,
              right: right.answerId,
              isMatched: left.answeredValue === right.answerId,
              position: i + 1,
            }
            questionData.answers.push(answer)
          }
        }
        break
      case 9:
        element.answers.forEach(answer => {
          questionData.essayContent = answer.essayContent
          questionData.urlFile = answer.urlFile
        })
        break
      default:
        break
    }
    return questionData
  },
  getLocalDataFromQuestion(question: any) {
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
  },

  // lấy dữ liệu lưu local storage từ câu khảo sát
  getLocalDataFromSurvey(question) {
    const localData = {
      id: question.questionId,
      isMark: question.isMark,
      isAnswered: question.isAnswered,
    }
    switch (question.questionTypeId) {
      // câu hỏi 2 lựa chọn
      case 1:
      case 5:
        question.answers.forEach(answer => {
          if (answer.answeredValue === 1) {
            answer.answeredValue = true
            localData.value = answer.answerId
            localData.isAnswered = true
          }
        })
        break
      case 2:
        localData.answers = []
        question.answers.forEach(answer => {
          if (answer.answeredValue === 1)
            answer.answeredValue = true

          if (answer.answeredValue === 0)
            answer.answeredValue = false

          localData.answers.push({
            id: answer.answerId,
            value: answer.answeredValue,
          })
        })
        break
      case 3:
        localData.answers = []
        question.answers.forEach(answer => {
          localData.answers.push({
            id: answer.answerId,
            value: answer.essayContent,
          })
        })
        break
      case 4:
        const answer = question.answers.find(x => x.answeredValue !== null)
        if (answer)
          localData.value = answer.answeredValue
        break
      default:
        break
    }
    return localData
  },

  // đồng bộ dữ liệu từ log
  synchronizedFromLog(questionStore: any, logData: any) {
    // lấy danh sách dữ liệu log theo log gần nhất
    questionStore.forEach((element: any) => {
      // nếu là câu hỏi chùm
      if (element.isGroup) {
        const question = this.findQuestionFromLog(element.id, logData)
        if (question !== null)
          element.isMark = question.isMark

        element.questions.forEach((childQuestion: any) => {
          const childQuestionLog = this.findQuestionFromLog(childQuestion.id, logData)
          if (childQuestionLog)
            this.synchronizedFromQuestionLog(childQuestion, childQuestionLog)
        })
        element.isAnswered = element.listQuestions.find(x => x.isAnswered) !== undefined
      }
      else {
        const childQuestionLog = this.findQuestionFromLog(element.id, logData)
        if (childQuestionLog) {
          this.synchronizedFromQuestionLog(element, childQuestionLog)
          element.isMark = childQuestionLog.isMark
        }
      }
    })
  },
  synchronizedFromQuestionLog(question, questionLog) {
    question.answers.forEach(element => {
      const answerLog = questionLog.answers.find(x => x.answerId === element.answerId)
      if (answerLog) {
        // câu hỏi tự luận
        if (question.questionTypeId === 9) {
          element.essayContent = answerLog.essayContent
          element.urlFile = answerLog.urlFile
        }
        else if (question.questionTypeId === 8) {
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
          element.answeredValue = parseInt(answerLog.answeredValue, 10)
        }
        else { element.answeredValue = null }
      }
    })
    if (question.questionTypeId === 9) {
      question.isAnswered = questionLog.answers.find(x => x.urlFile || (x.essayContent !== null && x.essayContent?.length > 0)) !== undefined
    }
    else if (question.questionTypeId === 8) {
      const answered = question.answers.find(x => x.isTrue === false && x.answeredValue !== null)
      question.isAnswered = !!answered
    }
    else {
      question.isAnswered = question.answers.find(x => x.answeredValue !== null) !== undefined
    }
  },

  // tìm kiếm question trong log
  findQuestionFromLog(questionId, logData) {
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
  },

  // chuẩn hóa dữ liệu khi review
  standardizedData(questionStore: any, isSurvey = false) {
    // Nếu là câu hỏi
    if (!isSurvey) {
      questionStore.forEach(question => {
        question.listQuestions.forEach(element => {
          switch (element.questionTypeId) {
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
    else {
      // nếu là câu khảo sát
      questionStore.forEach(element => {
        element.isAnswered = false
        switch (element.questionTypeId) {
          // câu hỏi 2 lựa chọn
          case 1:
          case 2:
          case 5:
            element.answers.forEach(answer => {
              if (answer.answeredValue === 1) {
                answer.answeredValue = true
                element.isAnswered = true
              }
              else { answer.answeredValue = false }
            })
            break
          case 4:
            element.isAnswered = element.answers.find(x => x.answeredValue !== null) !== undefined
            break // câu hỏi tự luận đã trả lời khi có nội  dung hoặc tệp tin
          case 3:
            if (element.answers.length > 0) {
              const answer = element.answers[0]
              // eslint-disable-next-line no-mixed-operators
              element.isAnswered = answer.essayContent !== null && answer.essayContent.length > 0 || answer.urlFile !== null
            }
            break
          case 6:
          case 7:
            if (element.listAnswerMatrix.length > 0)
              element.isAnswered = true

            break
          default:
            break
        }
      })
    }
  },

  // lấy dữ liệu đã lưu trong local
  getDataFromDataLocal(questionStore: any, localData: any) {
    // lưu local storage
    questionStore.forEach((element: any) => {
      let questionGroup: any = null
      if (!element.isAnswered)
        element.isAnswered = false
      questionGroup = localData.find((x: any) => x.id === element.id)
      if (questionGroup) {
        element.isMark = questionGroup.isMark
        element.isAnswered = questionGroup.isAnswered

        // nếu là câu hỏi đơn
        const questionLocal = questionGroup.questions.find(
          x => x.id === element.questionId,
        )
        if (questionLocal && questionLocal !== null) {
          switch (element.questionTypeId) {
            // câu hỏi 1 lựa chọn
            case 1:
            case 3:
              if (questionLocal.value !== null) {
                const answer = element.answers.find(
                  x => x.answerId === questionLocal.value,
                )
                if (answer)
                  answer.answeredValue = true
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
    })
  },

  // lấy dữ liệu đã lưu trong local
  getSurveyDataFromDataLocal(questionStore, localData) {
    // lưu local storage
    questionStore.forEach(question => {
      const questionLocal = localData.find(x => x.id === question.questionId)
      if (questionLocal && questionLocal !== null) {
        question.isMark = questionLocal.isMark
        question.isAnswered = questionLocal.isAnswered
        switch (question.questionTypeId) {
          // câu hỏi 1 lựa chọn
          case 1:
          case 5:
            if (questionLocal.value !== null) {
              const answer = question.answers.find(
                x => x.answerId === questionLocal.value,
              )
              if (answer)
                answer.answeredValue = true
            }
            break

          case 2:
            if (questionLocal.answers && questionLocal.answers !== null) {
              question.answers.forEach(answer => {
                const answerLocal = questionLocal.answers.find(
                  x => x.id === answer.answerId,
                )
                if (answerLocal)
                  answer.answeredValue = answerLocal.value
              })
            }
            break
          case 3:
            if (question.answers.length > 0) {
              question.answers[0].essayContent = questionLocal.essayContent
              question.answers[0].urlFile = questionLocal.urlFile
            }
            break
          case 4:
            if (questionLocal.value && questionLocal.value !== null) {
              question.answers.forEach(answer => {
                answer.answeredValue = questionLocal.value
              })
            }
            break
          case 6:
          case 7:
            if (questionLocal.listAnswerMatrix && questionLocal.listAnswerMatrix.length > 0)
              question.listAnswerMatrix = questionLocal.listAnswerMatrix

            break
          default:
            break
        }
      }
    })
  },

  // lưu dữ liệu local khi trả lời đáp án
  saveLocalData(data, questionStore, localData) {
    let questionLocal = null

    // câu hỏi chùm
    const group = localData.find(x => x.id === data.groupId)
    if (group) {
      if (group?.questions?.find(q => q?.isAnswered === true))
        group.isAnswered = true

      else
        group.isAnswered = data.isAnswered

      questionLocal = group.questions.find(x => x.id === data.id)
    }
    if (questionLocal) {
      switch (data.typeId) {
        case 1:
        case 3:
        case 4:
          questionLocal.value = data.value
          questionLocal.isAnswered = true
          questionLocal.isDataChange = true
          break
        case 2:
        case 5:
          if (questionLocal.answers) {
            const answer = questionLocal.answers.find(
              x => x.id === data.data.answerId,
            )
            if (answer)
              answer.value = data.data.value
          }

          questionLocal.value = data.value
          questionLocal.isDataChange = true
          break
        case 7:
        case 6:
        case 8:
          questionLocal.answers = data.value
          questionLocal.isDataChange = true
          break
        case 9:
          questionLocal.essayContent = data.value
          questionLocal.urlFile = data.urlFile
          questionLocal.isDataChange = true
          break
        default:
          break
      }
    }
  },

  // lưu dữ liệu local khi trả lời đáp án bài khảo sát
  saveSurveyLocalData(data, localData) {
    const questionLocal = localData.find(x => x.questionId === data.id || x.id === data.id)
    if (questionLocal) {
      switch (data.typeId) {
        case 1:
        case 4:
        case 5:
          questionLocal.value = data.value
          questionLocal.isAnswered = true
          break
        case 2:
          if (questionLocal.answers) {
            const answer = questionLocal.answers.find(
              x => x.id === data.data.answerId,
            )
            if (answer)
              answer.value = data.data.value
          }
          questionLocal.isAnswered = data.isAnswered
          break
        case 3:
          questionLocal.essayContent = data.value
          questionLocal.urlFile = data.urlFile
          questionLocal.isAnswered = data.isAnswered
          break
        case 6:
        case 7:
          questionLocal.listAnswerMatrix = data.listAnswerMatrix
          if (data.listAnswerMatrix && data.listAnswerMatrix.length > 0)
            questionLocal.isAnswered = true

          else
            questionLocal.isAnswered = false

          break
        default:
          break
      }
    }
  },

  // lấy đáp án của người dùng
  getUserAnswer(questionStore) {
    const model = {
      listData: [],
    }

    questionStore.forEach(element => {
      let questionData = null
      questionData = {
        questionId: element.id,
        isMark: element.isMark,
        listAnswer: [],
      }

      // nếu là câu hỏi chùm
      if (element.isQuestionGroup === true) {
        element.listQuestions.forEach(question => {
          model.listData.push({
            questionId: question.questionId,
            listAnswer: this.getListUserAnswer(question),
          })
        })
      }
      else if (element.listQuestions.length > 0) {
        questionData.listAnswer = this.getListUserAnswer(element.listQuestions[0])
      }

      model.listData.push(questionData)
    })
    return model
  },

  // lấy đáp án của người dùng
  getFormatAnwerUser(element: any) {
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
  },
  getExamUserAnswer(questionStore: any) {
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
  },

  // lấy đáp án của người dùng bài khảo sát
  getSurveyUserAnswer(questionStore: any) {
    const model: any = {
      listData: [],
    }
    questionStore.forEach((element: any) => {
      let questionData = null
      questionData = {
        questionId: element.questionId,
        isMark: element.isMark,
        listAnswer: [],
        listAnswerMatrix: element.listAnswerMatrix || null,
        questionTypeId: element.questionTypeId,
      }
      questionData.listAnswer = this.getListUserAnswer(element, true) as never
      if (questionData.listAnswer !== null)
        model.listData.push(questionData)
    })

    return model
  },

  // lấy đáp án của người có sự thay đổi
  getExamUserAnswerChange(questionStore, localStorageData) {
    const model = {
      listData: [],
    }

    // tìm những câu hỏi có dữ liệu thay đổi ở local storage
    const listIdQuestionChange = []
    if (localStorageData?.questions?.length) {
      localStorageData?.questions?.forEach(el => {
        el?.questions?.forEach(q => {
          if (q?.isDataChange === true && q?.id)
            listIdQuestionChange.push(q.id)
        })
      })
    }
    questionStore.forEach(element => {
      // chỉ lấy những câu hỏi có sự thay đổi đáp án
      if (element.isDataChange === true || element.listQuestions?.find(x => x.isDataChange === true)
      || (listIdQuestionChange.length && element.listQuestions.find(x => listIdQuestionChange.includes(x.questionId)))) {
        let questionData = null

        questionData = {
          questionId: element.id,
          isMark: element.isMark,
          answers: [],
        }

        // nếu là câu hỏi chùm
        if (element.isQuestionGroup === true) {
          element.listQuestions.forEach(question => {
            if (question?.isDataChange === true || listIdQuestionChange.includes(question.questionId)) {
              model.listData.push({
                questionId: question.questionId,
                answers: this.getListUserAnswer(question),
              })
            }
          })
        }
        else if (element.listQuestions.length > 0) {
          questionData.answers = this.getListUserAnswer(element.listQuestions[0])
        }
        model.listData.push(questionData)
        element.isDataChange = false
      }
    })
    return model
  },

  // lấy danh sách câu trả lời của người dùng
  getListUserAnswer(question: any) {
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
    return listAnswer
  },

  // lấy dánh sách câu hỏi từ json
  getQuestionFromJson(dataJson) {
    const data = JSON.parse(dataJson)

    // set các thuộc tính ban đầu
    data.forEach(element => {
      if (!element.isMark)
        element.isMark = false
      if (!element.isAnswered)
        element.isAnswered = false
    })
    return data
  },

  // tìm kiếm loại câu hỏi cho dữ liệu log server
  findQuestionTypeForLogServe(questionStore, dataLogServer) {
    dataLogServer?.questions?.forEach(ques => {
      const question = this.searchQuestionById(questionStore, ques.questionId, 'listQuestions')
      if (question?.isQuestionGroup) {
        ques.isQuestionGroup = true
        return
      }
      if (question) {
        const qsStore = question?.isQuestionGroup === false ? question?.listQuestions[0] : question
        ques.questionTypeId = qsStore.questionTypeId
        if (ques.questionTypeId === 8) {
          qsStore.answers.filter(item => !item.isTrue).forEach(el => {
            const answerLeft = ques.answers.find(i => i.answerId === el.answerId)
            if (answerLeft) {
              answerLeft.isLeft = true
              answerLeft.position = el.position
            }
          })
        }
      }
    })
  },

  // tìm kiếm question từ id câu hỏi
  searchQuestionById(arr, id, propertyName = 'questions') {
    for (let i = 0; i < arr.length; i += 1) {
      if ((propertyName === 'questions' && arr[i].id === id)
        || (propertyName === 'listQuestions' && (arr[i]?.questionId === id || arr[i]?.id === id)))
        return arr[i]

      if (arr[i] && `${propertyName}` in arr[i] && arr[i][propertyName]?.length) {
        const found = this.searchQuestionById(arr[i][propertyName], id, propertyName)
        if (found)
          return found
      }
    }
    return null
  },

  // so sánh dữ liệu từ local storage với dữ liệu lưu log trên server
  combineDataLog(dataServerLog, dataLocal) {
    dataServerLog.forEach(item => {
      if (new Date(item?.createdDate).getTime() > new Date(dataLocal?.startTime).getTime())
        dataLocal.startTime = item.createdDate

      item.questions.forEach(el => {
        const ques = this.searchQuestionById(dataLocal.questions, el.questionId)
        if (ques) {
          ques.isMark = el.isMark
          if (el?.questionTypeId)
            this.updateDataLocalFromLogServer(ques, el)

          else if (el?.isQuestionGroup)
            ques.isQuestionGroup = true
        }
      })
    })

    // cập nhật isAnswered cho câu hỏi chùm
    const questionGroup = dataLocal?.questions?.filter(item => item.isQuestionGroup)
    if (questionGroup?.length) {
      questionGroup?.forEach(el => {
        if (el?.questions?.find(i => i.isAnswered))
          el.isAnswered = true
      })
    }
  },

  // đồng bộ dữ liệu mới từ log server vào local storage
  updateDataLocalFromLogServer(questionLocal, questionLogServer) {
    const questionTypeId = questionLogServer?.questionTypeId
    const questionData = !questionLocal?.questions ? questionLocal : questionLocal?.questions[0]
    questionData.isDataChange = false
    switch (questionTypeId) {
      case 1:
      case 3:
        const answerItem = questionLogServer?.answers?.find(i => Number(i.answeredValue) === 1)
        if (answerItem) {
          questionData.value = answerItem.answerId
          questionLocal.isAnswered = true
        }
        break
      case 4:
        if (!questionLogServer?.answers.length || (questionLogServer?.answers[0]?.answeredValue === null)) {
          questionData.value = null
          questionLocal.isAnswered = false
        }
        else if (Number(questionLogServer?.answers[0]?.answeredValue) === 1) {
          questionData.value = true
          questionLocal.isAnswered = true
        }
        else if (Number(questionLogServer?.answers[0]?.answeredValue) === 0) {
          questionData.value = false
          questionLocal.isAnswered = true
        }
        break
      case 2:
      case 5:
        questionData?.answers?.forEach(answer => {
          const answerItem = questionLogServer?.answers?.find(i => i.answerId === answer.id && i.answeredValue)
          if (answerItem) {
            answer.value = Number(answerItem.answeredValue) === 1
            questionLocal.isAnswered = true
          }
        })
        break
      case 6:
      case 7:
        const answerServe = questionLogServer?.answers?.find(q => Number(q.answeredValue) === 1)
        if (answerServe) {
          const answerLocal = questionData?.answers?.find(q => q.id === answerServe.answerId)
          if (answerLocal) {
            answerLocal.value = 1
            questionLocal.isAnswered = true
          }
        }
        break
      case 8:
        questionData.answers = []
        questionLogServer.answers.filter(item => !item?.isLeft).forEach(el => {
          questionData.answers.push({
            left: null,
            right: el.answerId,
            isMatched: false,
            position: Number(el.answeredValue),
          })
        })
        questionLogServer.answers.filter(item => item?.isLeft).forEach(el => {
          const answer = questionData?.answers?.find(q => q.position === el.position)
          if (answer) {
            answer.left = el.answerId
            answer.isMatched = !!el?.answeredValue
          }
          if (answer?.isMatched)
            questionLocal.isAnswered = true
        })
        break
      case 9:
        if (questionLogServer?.answers.length && questionLogServer.answers[0]?.essayContent) {
          questionData.essayContent = questionLogServer?.answers[0]?.essayContent || null
          questionData.urlFile = questionLogServer?.answers[0]?.urlFile || null
          questionLocal.isAnswered = true
        }
        break
      default:
        break
    }
  },
}
