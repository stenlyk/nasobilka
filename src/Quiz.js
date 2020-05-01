import React from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import linq from "linq";

export default class Quiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      questions: {},
      wrong: {},
      position: 0,
      answers: [],
      submited: false,
      correctAnswer: "",
      correctAnswerState: "success",
      done: false,
    };
  }

  componentDidMount() {
    if (this.props.fixWrong) {
      this.generateQuestionsFromWrong();
    } else {
      this.generateQuestions();
    }
  }

  reload(event) {
    this.setState(this.initialState);
    setTimeout(() => {
      this.generateQuestions();
    }, 100);
    event.preventDefault();
  }

  handleChange(event) {
    let answers = this.state.answers;
    console.log(event.target);
    const pos = this.state.position;
    const questions = this.state.questions;
    const keys = Object.keys(questions);
    const q = questions[keys[pos]];
    const name = event.target.name;

    if (q.method === "del" && q.delMode === "modulo") {
      if (!answers[pos]) {
        answers[pos] = {};
      }
      answers[pos][name] = Number(event.target.value);
    } else {
      answers[pos] = Number(event.target.value);
    }
    this.setState({ answers });
  }

  handleSubmit(event) {
    const state = this.state;
    const questions = state.questions;
    let wrong = state.wrong;
    const answers = state.answers;
    const position = state.position;
    console.log(Object.keys(questions).length, position);
    if (Object.keys(questions).length > position) {
      const key = Object.keys(questions)[position];
      const q = questions[key];
      let timeout = 2000;
      this.setState({
        submited: true,
      });
      let lsAnswers = reactLocalStorage.getObject("answers", []);

      q.date = new Date().toISOString().slice(0, 10);
      const id = new Date().valueOf();

      if (this.evaluate(q, answers[position])) {
        // FixWrong update old example
        if (this.props.fixWrong) {
          lsAnswers = lsAnswers.map((a) => {
            return a.id === q.id && a.isCorrect === false
              ? { ...a, isFixed: true, points: 1 }
              : a;
          });
        }

        q.points = 1;
        q.id = id;
        q.isCorrect = true;
        lsAnswers.push(q);

        this.setState({
          correctAnswer: "Správně!",
          correctAnswerState: "success",
        });
        timeout = 800;
      } else {
        q.points = 0;
        q.id = id;
        q.isCorrect = false;
        lsAnswers.push(q);

        wrong[key] = q;

        let correct = this.getCorrectAnswer(q);
        if (typeof correct === "object") {
          this.setState({
            correctAnswer:
              "Správná odpověď je " +
              correct.num +
              " a zbytek " +
              correct.modulo,
            correctAnswerState: "danger",
            wrong,
          });
        } else {
          this.setState({
            correctAnswer: "Správná odpověď je " + correct,
            correctAnswerState: "danger",
            wrong,
          });
        }
      }

      reactLocalStorage.setObject("answers", lsAnswers);

      setTimeout(
        () =>
          this.setState({
            position: position + 1,
            submited: false,
          }),
        timeout
      );
    }
    if (Object.keys(questions).length === position + 1) {
      this.setState({ done: true });
      console.log(Object.keys(questions).length, position);
    }

    event.preventDefault();
  }

  evaluate(question, answer) {
    const correct = this.getCorrectAnswer(question);
    if (typeof correct === "object") {
      return correct.num === answer.num && correct.modulo === answer.modulo;
    } else {
      return correct === answer;
    }
  }

  getCorrectAnswer(question) {
    if (question.method === "del" && question.delMode === "modulo") {
      const num = Math.floor(question.num1 / question.num2);
      const modulo = question.num1 % question.num2;
      return { num, modulo };
    } else {
      if (question.side === "right") {
        if (question.method === "nas") return question.num1 * question.num2;
        if (question.method === "sci") return question.num1 + question.num2;
      }
      if (question.first) {
        return question.num2;
      }
      return question.num1;
    }
  }

  setDone(event, victory) {
    const questions = this.state.questions;
    if (victory) {
      this.setState({
        done: true,
        answers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        position: 10,
      });
    } else {
      this.setState({
        done: true,
        answers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        position: 10,
        wrong: Object.entries(questions)
          .slice(0, 4)
          .map((entry) => entry[1]),
      });
    }
    event.preventDefault();
  }

  generateQuestions() {
    for (let index = 0; index < 10; index++) {
      this.generateQuestion();
    }
  }

  randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  generateQuestion() {
    const num = this.props.selected.num;
    const basicMathNum = this.props.selected.basicMathNum[0];
    const skils = this.props.selected.skils;
    const delMode = this.props.selected.delMode;

    const sides = ["left", "right"];
    const methods = ["nas", "del"];
    const methodsBasic = ["sci", "odc"];
    let usedQuestions = this.state.questions;

    let num1 = 1;
    let num2 = 1;
    let side = "left";
    let method = "nas";
    let first = true;
    let statsKey = false;

    if (Object.keys(usedQuestions).length < 10) {
      if (skils.nas === true || skils.del === true) {
        num1 = Math.floor(Math.random() * 11);
        num2 = num[Math.floor(Math.random() * num.length)];
        side = sides[Math.floor(Math.random() * sides.length)];
        first = Math.floor(Math.random() * 1000) % 2 === 0 ? true : false;
        method = skils.nas ? "nas" : "del";

        if (skils.nas === true && skils.del === true) {
          method = methods[Math.floor(Math.random() * methods.length)];
        }

        if (method === "del" && delMode === "modulo") {
          num1 = this.randomIntFromInterval(num2, num2 * 10);
          if (num1 % num2 === 0) {
            num1 = this.randomIntFromInterval(num2, num2 * 10);
          }
          side = "right";
          first = false;
        }

        if (num1 === 0) {
          side = "right";
          first = false;
        }
        statsKey = num2;
      }

      if (skils.sci === true || skils.odc === true) {
        let minMax = basicMathNum.split("-");

        num1 = this.randomIntFromInterval(minMax[0], minMax[1]);
        num2 = this.randomIntFromInterval(minMax[0], minMax[1]);

        side = sides[Math.floor(Math.random() * sides.length)];
        first = Math.floor(Math.random() * 1000) % 2 === 0 ? true : false;
        method = skils.sci ? "sci" : "odc";

        if (skils.sci === true && skils.odc === true) {
          method =
            methodsBasic[Math.floor(Math.random() * methodsBasic.length)];
        }

        if (method === "odc" && num1 < num2) {
          let origNum1 = num1;
          num1 = num2;
          num2 = origNum1;
        }

        if (method === "odc" && num1 + num2 > minMax[1]) {
          if (num1 > num2) {
            num1 = Math.floor(num1 / 2);
          } else {
            num2 = Math.floor(num2 / 2);
          }
          if (num1 + num2 > minMax[1]) {
            if (num1 > num2) {
              num1 = Math.floor(num1 / 2);
            } else {
              num2 = Math.floor(num2 / 2);
            }
          }
        }

        if (method === "sci" && num1 + num2 > minMax[1]) {
          if (num1 > num2) {
            num1 = Math.floor(num1 / 2);
          } else {
            num2 = Math.floor(num2 / 2);
          }
          if (num1 + num2 > minMax[1]) {
            if (num1 > num2) {
              num1 = Math.floor(num1 / 2);
            } else {
              num2 = Math.floor(num2 / 2);
            }
          }
        }

        if (num1 === 0) {
          side = "right";
          first = false;
        }
        // console.log(num1, num2, minMax[1]);
        statsKey = basicMathNum;
      }

      const key = method + "|" + side + "|" + first + "|" + num1 + "|" + num2;
      if (usedQuestions[key]) {
        this.generateQuestion();
      }
      usedQuestions[key] = {
        num1,
        num2,
        method,
        side,
        first,
        statsKey,
        delMode,
      };

      this.setState((state) => ({
        ...state,
        questions: usedQuestions,
      }));
    }
  }

  notFixed(obj) {
    return obj.fixed === undefined;
  }

  generateQuestionsFromWrong() {
    let usedQuestions = this.state.questions;

    let lsWrong = reactLocalStorage.getObject("answers", []);
    lsWrong = linq
      .from(lsWrong)
      .where(function (x) {
        return x.isCorrect === false || x.isFixed === false;
      })
      .shuffle()
      .toArray();

    for (let index = 0; index < 10; index++) {
      usedQuestions[index] = lsWrong[index];
    }
    this.setState((state) => ({
      ...state,
      questions: usedQuestions,
    }));
  }

  renderQuestion() {
    const position = this.state.position;
    const questions = this.state.questions;
    const submited = this.state.submited;
    const correctAnswer = this.state.correctAnswer;
    const correctAnswerState = this.state.correctAnswerState;
    // console.log(questions);
    const q = questions[Object.keys(questions)[position]];
    const num1 = q.num1;
    const num2 = q.num2;
    const side = q.side;
    const method = q.method;
    const first = q.first;
    const delMode = q.delMode;
    return (
      <>
        <div className="row question justify-content-center align-items-center">
          <div className="col">
            {this.renderMethod(method, num1, num2, side, first, delMode)}
          </div>
        </div>
        {submited ? (
          <div className={"alert alert-" + correctAnswerState}>
            {correctAnswer}
          </div>
        ) : (
          <div className="alert"></div>
        )}
        <div className="row text-right">
          <div className="col">
            <input type="submit" className="btn" value="Zkontrolovat" />
          </div>
        </div>
      </>
    );
  }

  renderMethod(method, num1, num2, side, first, delMode) {
    switch (method) {
      case "nas":
        return this.renderMultiplication(num1, num2, side, first);
      case "del":
        return this.renderDivade(num1, num2, side, first, delMode);
      case "sci":
        return this.renderSummation(num1, num2, side, first);
      case "odc":
        return this.renderSubtraction(num1, num2, side, first);
      default:
        break;
    }
  }

  renderMultiplication(num1, num2, side, first) {
    const key = "nas|" + side + "|" + first + "|" + num1 + "|" + num2;
    return side === "left" ? (
      <h2>
        {first ? num1 : num2} <span className="mul">*</span>{" "}
        <input
          key={key}
          type="number"
          name="num"
          min="0"
          step="1"
          required
          autoFocus
          onChange={(e) => this.handleChange(e)}
        />{" "}
        <span>=</span>
        {num1 * num2}
      </h2>
    ) : (
      <h2>
        {num1} <span className="mul">*</span> {num2} <span>=</span>{" "}
        <input
          key={key}
          type="number"
          name="num"
          min="0"
          step="1"
          required
          autoFocus
          onChange={(e) => this.handleChange(e)}
        />
      </h2>
    );
  }

  renderDivade(num1, num2, side, first, delMode) {
    const key = "del|" + side + "|" + first + "|" + num1 + "|" + num2;
    const total = num1 * num2;
    if (delMode === "modulo") return this.renderModulo(num1, num2, key);
    return side === "left" ? (
      <h2>
        {total} <span className="div">:</span>{" "}
        <input
          key={key}
          type="number"
          name="num"
          min="0"
          step="1"
          required
          autoFocus
          onChange={(e) => this.handleChange(e)}
        />{" "}
        <span>=</span>
        {first ? num1 : num2}
      </h2>
    ) : (
      <h2>
        {total} <span className="div">:</span> {first ? num1 : num2}{" "}
        <span>=</span>{" "}
        <input
          key={key}
          type="number"
          name="num"
          min="0"
          step="1"
          required
          autoFocus
          onChange={(e) => this.handleChange(e)}
        />
      </h2>
    );
  }
  renderModulo(num1, num2, key) {
    return (
      <>
        <table>
          <tr>
            <td>
              <h2>
                {num1} <span className="div">:</span> {num2} <span>=</span>{" "}
              </h2>
            </td>
            <td>
              <input
                key={key}
                type="number"
                name="num"
                min="0"
                step="1"
                required
                autoFocus
                onChange={(e) => this.handleChange(e)}
              />
            </td>
          </tr>
          <tr className="small">
            <td>
              <h3>zbytek </h3>
            </td>
            <td>
              <input
                key={key + "modulo"}
                type="number"
                name="modulo"
                min="0"
                step="1"
                required
                onChange={(e) => this.handleChange(e)}
              />
            </td>
          </tr>
        </table>
      </>
    );
  }

  renderSummation(num1, num2, side, first) {
    const key = "sci|" + side + "|" + first + "|" + num1 + "|" + num2;
    return side === "left" ? (
      <h2 className={num1 > 999 || num2 > 999 ? "smallNumber" : null}>
        {first ? num1 : num2} <span className="mul">+</span>{" "}
        <input
          key={key}
          type="number"
          name="num"
          min="0"
          step="1"
          required
          autoFocus
          onChange={(e) => this.handleChange(e)}
        />{" "}
        <span>=</span>
        {num1 + num2}
      </h2>
    ) : (
      <h2 className={num1 > 999 || num2 > 999 ? "smallNumber" : null}>
        {num1} <span className="mul">+</span> {num2} <span>=</span>{" "}
        <input
          key={key}
          type="number"
          name="num"
          min="0"
          step="1"
          required
          autoFocus
          onChange={(e) => this.handleChange(e)}
        />
      </h2>
    );
  }

  renderSubtraction(num1, num2, side, first) {
    const key = "odc|" + side + "|" + first + "|" + num1 + "|" + num2;
    console.log(key);
    const total = num1 + num2;
    return side === "left" ? (
      <h2 className={num1 > 999 || num2 > 999 ? "smallNumber" : null}>
        {total} <span className="div">-</span>{" "}
        <input
          key={key}
          type="number"
          name="num"
          min="0"
          step="1"
          required
          autoFocus
          onChange={(e) => this.handleChange(e)}
        />{" "}
        <span>=</span>
        {first ? num1 : num2}
      </h2>
    ) : (
      <h2 className={num1 > 999 || num2 > 999 ? "smallNumber" : null}>
        {total} <span className="div">-</span> {first ? num1 : num2}{" "}
        <span>=</span>{" "}
        <input
          key={key}
          type="number"
          name="num"
          min="0"
          step="1"
          required
          autoFocus
          onChange={(e) => this.handleChange(e)}
        />
      </h2>
    );
  }

  renderViewMethod(method, num1, num2, side, first, delMode) {
    switch (method) {
      case "nas":
        return this.renderViewMultiplication(num1, num2, side, first);
      case "del":
        return this.renderViewDivade(num1, num2, side, first, delMode);
      case "sci":
        return this.renderViewSummation(num1, num2, side, first);
      case "odc":
        return this.renderViewSubtraction(num1, num2, side, first);
      default:
        break;
    }
  }

  renderViewMultiplication(num1, num2, side, first) {
    const total = num1 * num2;
    const key = "nas|" + side + "|" + first + "|" + num1 + "|" + num2;
    return side === "left" ? (
      <h3 key={key}>
        {first ? num1 : num2} *{" "}
        <strong className="bg-danger">{first ? num2 : num1}</strong> ={" "}
        {num1 * num2}
      </h3>
    ) : (
      <h3 key={key}>
        {num1} * {num2} = <strong className="bg-danger">{total}</strong>
      </h3>
    );
  }

  renderViewDivade(num1, num2, side, first, delMode) {
    const key = "del|" + side + "|" + first + "|" + num1 + "|" + num2;
    const total = num1 * num2;
    if (delMode === "modulo") return this.renderViewModulo(num1, num2, key);
    return side === "left" ? (
      <h3 key={key}>
        {total} : <strong className="bg-danger">{first ? num2 : num1}</strong> ={" "}
        {first ? num1 : num2}
      </h3>
    ) : (
      <h3 key={key}>
        {total} : {first ? num1 : num2} ={" "}
        <strong className="bg-danger">{first ? num2 : num1}</strong>
      </h3>
    );
  }

  renderViewModulo(num1, num2, key) {
    const num = Math.floor(num1 / num2);
    const modulo = num1 % num2;
    return (
      <>
        <h3 key={key}>
          {num1} <span className="div">:</span> {num2} <span>=</span>{" "}
          <strong className="bg-danger">{num}</strong> z.{" "}
          <strong className="bg-danger">{modulo}</strong>
        </h3>
      </>
    );
  }

  renderViewSummation(num1, num2, side, first) {
    const key = "sci|" + side + "|" + first + "|" + num1 + "|" + num2;
    const total = num1 + num2;
    return side === "left" ? (
      <h3 key={key} className={num1 > 999 || num2 > 999 ? "smallNumber" : null}>
        {first ? num1 : num2} <span className="mul">+</span>{" "}
        <strong className="bg-danger">{first ? num2 : num1}</strong>
        <span>=</span>
        {num1 + num2}
      </h3>
    ) : (
      <h3 key={key} className={num1 > 999 || num2 > 999 ? "smallNumber" : null}>
        {num1} <span className="mul">+</span> {num2} <span>=</span>{" "}
        <strong className="bg-danger">{total}</strong>
      </h3>
    );
  }

  renderViewSubtraction(num1, num2, side, first) {
    const key = "odc|" + side + "|" + first + "|" + num1 + "|" + num2;
    const total = num1 + num2;
    return side === "left" ? (
      <h3 key={key} className={num1 > 999 || num2 > 999 ? "smallNumber" : null}>
        {total} <span className="div">-</span>{" "}
        <strong className="bg-danger">{first ? num2 : num1}</strong>{" "}
        <span>=</span>
        {first ? num1 : num2}
      </h3>
    ) : (
      <h3 className={num1 > 999 || num2 > 999 ? "smallNumber" : null}>
        {total} <span className="div">-</span> {first ? num1 : num2}{" "}
        <span>=</span>{" "}
        <strong className="bg-danger">{first ? num2 : num1}</strong>
      </h3>
    );
  }

  renderWrong(wrong) {
    const items = Object.keys(wrong);
    return items.map((key) => {
      const w = wrong[key];
      return (
        <div className="col-6" key={key}>
          {this.renderViewMethod(
            w.method,
            w.num1,
            w.num2,
            w.side,
            w.first,
            w.delMode
          )}
        </div>
      );
    });
  }

  renderSummary() {
    const questions = this.state.questions;
    const wrong = this.state.wrong;

    const countQ = Object.keys(questions).length;
    const countW = Object.keys(wrong).length;

    const titles = [
      "Excelentně!",
      "Výborně.",
      "Skvěle.",
      "Dobrá práce.",
      "Ještě to chce zlepšit.",
      "Trénink dělá mistra.",
      "Nevěš hlavu a trénuj.",
      "Zkus to znova a lépe.",
      "Zkus to znova a lépe.",
      "Tak to se nepovedlo.",
      "Trénuj, trénuj, trénuj!",
    ];

    return (
      <>
        <h4 className="text-center quizHeader">{titles[countW]}</h4>
        <h5 className="text-center quizHeader">Koukni, jak ti to šlo.</h5>
        <div className="row quiz justify-content-around">
          <div className="col">
            <div className="badge success">
              <img
                src={process.env.PUBLIC_URL + "/ic-good-badge.svg"}
                alt="x"
              />
              <span>{countQ - countW}</span>
              <h4>Správně</h4>
            </div>
          </div>
          {countW !== 0 ? (
            <div className="col">
              <div className="badge danger">
                <img
                  src={process.env.PUBLIC_URL + "/ic-wrong-badge.svg"}
                  alt="x"
                />
                <span>{countW}</span>
                <h4>Chybně</h4>
              </div>
            </div>
          ) : null}
        </div>
        {countW > 0 ? (
          <>
            <hr />
            <div className="row quiz">
              <div className="col">
                <h4>Pojď, projdeme tvé chybné odpovědi</h4>
                <div className="row resume">{this.renderWrong(wrong)}</div>
              </div>
            </div>
          </>
        ) : null}
        <hr />
        <div className="row quiz">
          <div className="col text-right">
            <button
              className="btn btn-primary btn-lg"
              onClick={(e) => this.reload(e)}
            >
              Začít znovu
            </button>
          </div>
        </div>
      </>
    );
  }

  render() {
    const total = Object.keys(this.state.questions);
    const wrong = this.state.wrong;
    const position = this.state.position;
    const done = this.state.done;
    // console.log(this.state.questions);
    if (total.length === 0) {
      return null;
    }

    return (
      <>
        <div>
          {done ? (
            this.renderSummary()
          ) : (
            <>
              <div className="progress justify-content-between">
                {total.map((key, i) => {
                  let status = "";
                  if (i < position) {
                    status = wrong[key] ? "danger" : "success";
                  }
                  if (i === position) {
                    status = "current";
                  }

                  return <div key={i} className={status + " bullet"}></div>;
                })}
              </div>
              <form onSubmit={(e) => this.handleSubmit(e)} autoComplete="off">
                {this.renderQuestion()}
              </form>
            </>
          )}
        </div>
      </>
    );
  }
}
