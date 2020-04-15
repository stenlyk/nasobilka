import React from "react";
import { reactLocalStorage } from "reactjs-localstorage";

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
    this.generateQuestions();
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
    answers[this.state.position] = Number(event.target.value);
    this.setState({ answers });
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
      let timeout = 3000;
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
        timeout = 1000;
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

  generateQuestions() {
    for (let index = 0; index < 10; index++) {
      this.generateQuestion();
    }
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

    if (Object.keys(usedQuestions).length < 10) {
      num1 = Math.floor(Math.random() * 11);
      num2 = num[Math.floor(Math.random() * num.length)];
      side = sides[Math.floor(Math.random() * sides.length)];
      first = Math.floor(Math.random() * 1000) % 2 === 0 ? true : false;
      method = nas ? "nas" : "del";

      if (nas && del) {
        method = methods[Math.floor(Math.random() * methods.length)];
      }

      if (num1 === 0) {
        side = "right";
        first = false;
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
        <div className="row question justify-content-center align-items-center">
          <div className="col">
            {method === "nas"
              ? this.renderMultiplication(num1, num2, side, first)
              : this.renderDivade(num1, num2, side, first)}
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
            <input
              type="submit"
              className="btn btn-primary btn-lg"
              value="Zkontrolovat"
            />
          </div>
        </div>
      </>
    );
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
          max="10"
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

  renderDivade(num1, num2, side, first) {
    const key = "del|" + side + "|" + first + "|" + num1 + "|" + num2;
    const total = num1 * num2;
    return side === "left" ? (
      <h2>
        {total} <span className="div">:</span>{" "}
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

  renderViewMultiplication(num1, num2, side, first) {
    const total = num1 * num2;
    const key = "nas|" + side + "|" + first + "|" + num1 + "|" + num2;
    return side === "left" ? (
      <h3 key={key}>
        {first ? num1 : num2} *
        <strong className="bg-danger">{first ? num2 : num1}</strong> =
        {num1 * num2}
      </h3>
    ) : (
      <h3 key={key}>
        {num1} * {num2} =<strong className="bg-danger">{total}</strong>
      </h3>
    );
  }

  renderViewDivade(num1, num2, side, first) {
    const key = "del|" + side + "|" + first + "|" + num1 + "|" + num2;
    const total = num1 * num2;
    return side === "left" ? (
      <h3 key={key}>
        {total} : <strong className="bg-danger">{first ? num2 : num1}</strong> =
        {first ? num1 : num2}
      </h3>
    ) : (
      <h3 key={key}>
        {total} : {first ? num1 : num2} =
        <strong className="bg-danger">{first ? num2 : num1}</strong>
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
        <div className="row quiz justify-content-around">
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
        {countW > 0 ? (
          <div className="row quiz">
            <div className="col">
              <h2>Tady jsou ještě jednou tvé chybné odpovědi</h2>
              {this.renderWrong(wrong)}
            </div>
          </div>
        ) : null}
        <div className="row quiz">
          <div className="col">
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
    const total = Object.keys(this.state.questions).length;
    const wrong = Object.keys(this.state.wrong).length;
    const position = this.state.position;
    const done = this.state.done;
    const progress = ((position + 1 - wrong) / total) * 100 + "%";
    const progressWrong = (wrong / total) * 100 + "%";
    // console.log(this.state.questions);
    if (total === 0) {
      return null;
    }

    return (
      <div>
        {done ? (
          this.renderSummary()
        ) : (
          <>
            <div className="progress no-radius">
              <div
                className="progress-bar bg-info"
                role="progressbar"
                style={{ width: progress }}
              ></div>
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
