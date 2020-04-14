import React from "react";
import { reactLocalStorage } from "reactjs-localstorage";

export default class Quiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
    for (let index = 0; index < 10; index++) {
      this.generateQuestion();
    }
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

  reload(event) {
    this.setState(this.initialState);
    for (let index = 0; index < 10; index++) {
      this.generateQuestion();
    }
    event.preventDefault();
  }

  handleChange(event) {
    let answers = this.state.answers;
    answers[this.state.position] = Number(event.target.value);
    this.setState(answers);
  }

  handleSubmit(event) {
    const state = this.state;
    const questions = state.questions;
    let wrong = state.wrong;
    const answers = state.answers;
    const position = state.position;

    if (Object.keys(questions).length > position) {
      const key = Object.keys(questions)[position];
      const q = questions[key];
      let timeout = 300;
      this.setState({
        submited: true,
      });
      q.date = new Date().toISOString().slice(0, 10);

      if (this.evaluate(q, answers[position])) {
        let lsCorrect = reactLocalStorage.getObject("correct", []);
        lsCorrect.push(q);
        reactLocalStorage.setObject("correct", lsCorrect);

        this.setState({
          correctAnswer: "Správně",
          correctAnswerState: "success",
        });
        timeout = 100;
      } else {
        let corect = this.getCorrectAnswer(q);
        let lsWrong = reactLocalStorage.getObject("wrong", []);
        lsWrong.push(q);
        reactLocalStorage.setObject("wrong", lsWrong);

        wrong[key] = q;

        this.setState({
          correctAnswer: "Správná odpověď je " + corect,
          correctAnswerState: "danger",
          wrong,
        });
      }

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
    }

    event.preventDefault();
  }

  evaluate(question, answer) {
    const correct = this.getCorrectAnswer(question);
    return correct === answer;
  }

  getCorrectAnswer(question) {
    if (question.method === "nas" && question.side === "right") {
      return question.num1 * question.num2;
    }
    if (question.first) {
      return question.num2;
    }
    return question.num1;
  }

  generateQuestion() {
    const num = this.props.num;
    const nas = this.props.nas;
    const del = this.props.del;
    const sides = ["left", "right"];
    const methods = ["nas", "del"];
    let usedQuestions = this.state.questions;

    let num1 = 1;
    let num2 = 1;
    let side = "left";
    let method = "nas";
    let first = true;

    if (Object.keys(usedQuestions).length <= 10) {
      num1 = Math.floor(Math.random() * 11);
      num2 = num[Math.floor(Math.random() * num.length)];
      side = sides[Math.floor(Math.random() * sides.length)];
      first = Math.floor(Math.random() * 1000) % 2 === 0 ? true : false;
      method = nas ? "nas" : "del";

      if (num2 === 0) {
        num2 = num[0];
      }

      if (nas && del) {
        method = methods[Math.floor(Math.random() * methods.length)];
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
      };
      this.setState({ questions: usedQuestions });
    }
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
    return (
      <>
        <div className="row quiz">
          <div className="col">
            {method === "nas"
              ? this.renderMultiplication(num1, num2, side, first)
              : this.renderDivade(num1, num2, side, first)}
          </div>
        </div>
        <div className="row">
          <div className="col">
            {!submited ? (
              <input
                type="submit"
                className="btn btn-primary"
                value="Zkontrolovat"
              />
            ) : (
              <div className={"alert alert-" + correctAnswerState}>
                {correctAnswer}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  renderMultiplication(num1, num2, side, first) {
    const key = "nas|" + side + "|" + first + "|" + num1 + "|" + num2;
    return side === "left" ? (
      <h2>
        {first ? num1 : num2} *
        <input
          key={key}
          type="number"
          name="num"
          min="0"
          max="10"
          step="1"
          required
          autoFocus
          onChange={(e) => this.handleChange(e)}
        />{" "}
        ={num1 * num2}
      </h2>
    ) : (
      <h2>
        {num1} * {num2} =
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

  renderDivade(num1, num2, side, first) {
    const key = "del|" + side + "|" + first + "|" + num1 + "|" + num2;
    const total = num1 * num2;
    return side === "left" ? (
      <h2>
        {total} :
        <input
          key={key}
          type="number"
          name="num"
          min="0"
          max="10"
          step="1"
          required
          autoFocus
          onChange={(e) => this.handleChange(e)}
        />{" "}
        ={first ? num1 : num2}
      </h2>
    ) : (
      <h2>
        {total} : {first ? num1 : num2} =
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

  renderViewMultiplication(num1, num2, side, first) {
    const total = num1 * num2;
    const key = "nas|" + side + "|" + first + "|" + num1 + "|" + num2;
    return side === "left" ? (
      <h3 key={key}>
        {first ? num1 : num2} *<strong>{first ? num2 : num1}</strong> =
        {num1 * num2}
      </h3>
    ) : (
      <h3 key={key}>
        {num1} * {num2} =<strong>{total}</strong>
      </h3>
    );
  }

  renderViewDivade(num1, num2, side, first) {
    const key = "del|" + side + "|" + first + "|" + num1 + "|" + num2;
    const total = num1 * num2;
    return side === "left" ? (
      <h3 key={key}>
        {total} : <strong>{first ? num2 : num1}</strong> ={first ? num1 : num2}
      </h3>
    ) : (
      <h3 key={key}>
        {total} : {first ? num1 : num2} =<strong>{first ? num2 : num1}</strong>
      </h3>
    );
  }

  renderWrong(wrong) {
    const items = Object.keys(wrong);
    return items.map((key) => {
      const w = wrong[key];
      return w.method === "nas"
        ? this.renderViewMultiplication(w.num1, w.num2, w.side, w.first)
        : this.renderViewDivade(w.num1, w.num2, w.side, w.first);
    });
  }

  renderSummary() {
    const questions = this.state.questions;
    const wrong = this.state.wrong;

    const countQ = Object.keys(questions).length;
    const countW = Object.keys(wrong).length;

    return (
      <>
        <div className="row justify-content-around">
          <div className="col">
            <div className="btn btn-success">
              Správně{" "}
              <span className="badge badge-light">{countQ - countW}</span>
            </div>
          </div>
          <div className="col">
            <div className="btn btn-danger">
              Chybně <span className="badge badge-light">{countW}</span>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">{this.renderWrong(wrong)}</div>
        </div>
        <div className="row">
          <div className="col">
            <button className="btn btn-primary" onClick={(e) => this.reload(e)}>
              Začít znovu
            </button>
          </div>
        </div>
      </>
    );
  }

  render() {
    const total = Object.keys(this.state.questions).length;
    const wrong = Object.keys(this.state.wrong).length;
    const position = this.state.position;
    const done = this.state.done;
    const progress = ((position + 1 - wrong) / total) * 100 + "%";
    const progressWrong = (wrong / total) * 100 + "%";
    return (
      <div>
        {done ? (
          this.renderSummary()
        ) : (
          <>
            <div className="progress">
              <div
                className="progress-bar bg-info"
                role="progressbar"
                style={{ width: progress }}
              >
                {position + 1 - wrong} / {total}
              </div>
              <div
                className="progress-bar bg-danger"
                role="progressbar"
                style={{ width: progressWrong }}
              >
                {wrong} / {total}
              </div>
            </div>
            <form onSubmit={(e) => this.handleSubmit(e)} autoComplete="off">
              {this.renderQuestion()}
            </form>
          </>
        )}
      </div>
    );
  }
}
