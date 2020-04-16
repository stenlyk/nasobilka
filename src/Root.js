import React from "react";
import Start, { nums } from "./Start.js";
import Quiz from "./Quiz.js";
import { reactLocalStorage } from "reactjs-localstorage";
import CircleGraph from "./CircleGraph.js";

export default class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: { num: [1, 2, 3, 4], skils: { nas: true, del: true } },
      submited: false,
      error: "",
      num: nums,
      levels: { 20: "green", 50: "orange", 200: "silver", 500: "gold" },
      tab: "nas",
    };
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let selected = this.state.selected;
    if (name === "num") {
      if (target.checked) {
        selected.num.push(Number(value));
      } else {
        var index = selected.num.indexOf(Number(target.value));
        if (index !== -1) {
          selected.num.splice(index, 1);
        }
      }
    } else {
      selected.skils[name] = target.checked;
    }
    this.setState({ selected });
  }

  handleSubmit(event) {
    const selected = this.state.selected;

    if (selected.num.length > 0 && (selected.skils.nas || selected.skils.del)) {
      this.setState({ submited: true, error: "" });
    } else {
      this.setState({
        error: "Vyber alespoň jedno číslo a zvol násobení nebo dělení.",
      });
    }

    event.preventDefault();
  }

  leave(event) {
    this.setState({ submited: false });
    event.preventDefault();
  }

  switchTab(event) {
    this.setState({ tab: event.target.value });
  }

  renderStart() {
    const wrong = reactLocalStorage.getObject("wrong", []);
    const correct = reactLocalStorage.getObject("correct", []);
    const total = wrong.length + correct.length;
    return (
      <Start
        onChange={(e) => this.handleChange(e)}
        onSubmit={(e) => this.handleSubmit(e)}
        selected={this.state.selected}
        total={total}
      />
    );
  }

  renderQuiz() {
    return (
      <Quiz
        num={this.state.selected.num}
        nas={this.state.selected.skils.nas}
        del={this.state.selected.skils.del}
      />
    );
  }

  getLevel(points) {
    const levels = this.state.levels;
    const keys = Object.keys(levels);
    let result = ["green", 20];

    keys.forEach((key, index, elm) => {
      if (key < points) {
        result =
          index + 1 < keys.length
            ? [levels[elm[index + 1]], elm[index + 1]]
            : [levels[key], key];
      }
    });
    return result;
  }

  renderStat(stats) {
    // console.log(stats);
    const tab = this.state.tab;
    let data = stats.nas;
    if (this.state.tab !== "nas") {
      data = stats.del;
    }

    const num = this.state.num;
    //console.log(this.getLevel(0));
    let level = {};
    let percent = 0;

    return (
      <>
        <div className="radio-bar">
          <input
            type="radio"
            name="tab"
            value="nas"
            id="nas"
            checked={tab === "nas" ? true : false}
            onChange={(e) => this.switchTab(e)}
          />
          <label htmlFor="nas">Násobení</label>
          <input
            type="radio"
            name="tab"
            value="del"
            id="del"
            checked={tab === "del" ? true : false}
            onChange={(e) => this.switchTab(e)}
          />
          <label htmlFor="del">Ďelení</label>
        </div>
        <div className="row">
          <div className="col">
            <div className="justify-content-between flex-wrap">
              {num.map((i) => {
                level = this.getLevel(data[i]["correct"]);
                percent = (data[i]["correct"] / level[1]) * 100;
                return (
                  <div className="graph" key={i}>
                    <CircleGraph percent={percent} label={i} />
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        "/ic-" +
                        level[0] +
                        "-badge.svg"
                      }
                      alt={level[0]}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  }

  renderStats() {
    const num = this.state.num;
    const wrong = reactLocalStorage.getObject("wrong", []);
    const correct = reactLocalStorage.getObject("correct", []);
    let stats = { nas: {}, del: {}, today: { nas: {}, del: {} } };

    num.map((val) => {
      stats["nas"][val] = { correct: 0, wrong: 0 };
      stats["del"][val] = { correct: 0, wrong: 0 };
      stats["today"]["nas"][val] = { correct: 0, wrong: 0 };
      stats["today"]["del"][val] = { correct: 0, wrong: 0 };
      return null;
    });

    correct.map(
      (elm) =>
        (stats[elm.method][elm.num2]["correct"] = stats[elm.method][elm.num2][
          "correct"
        ]
          ? stats[elm.method][elm.num2]["correct"] + 1
          : 1)
    );
    wrong.map(
      (elm) =>
        (stats[elm.method][elm.num2]["wrong"] = stats[elm.method][elm.num2][
          "wrong"
        ]
          ? stats[elm.method][elm.num2]["wrong"] + 1
          : 1)
    );

    return (
      <>
        {this.renderStat(stats)}
        <hr />
        <div className="row legned info align-items-center">
          <div className="col-6">
            <img
              src={process.env.PUBLIC_URL + "/ic-green-badge.svg"}
              alt="Zelenáč"
            />{" "}
            <span>Zlenáč</span>
          </div>
          <div className="col-6">
            <img
              src={process.env.PUBLIC_URL + "/ic-orange-badge.svg"}
              alt="Chce to ještě trénink"
            />{" "}
            <span>Chce to ještě trénink</span>
          </div>
          <div className="col-6">
            <img
              src={process.env.PUBLIC_URL + "/ic-silver-badge.svg"}
              alt="Už jen kousek k cíli"
            />{" "}
            <span>Už jen kousek k cíli</span>
          </div>
          <div className="col-6">
            <img
              src={process.env.PUBLIC_URL + "/ic-gold-badge.svg"}
              alt="Počítáš na jedničku"
            />{" "}
            <span>Počítáš na jedničku</span>
          </div>
        </div>
      </>
    );
  }

  render() {
    const submited = this.state.submited;
    const error = this.state.error;
    return (
      <>
        {!submited ? (
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-sm-12">
                <div className="box">
                  {error !== "" ? (
                    <div className="alert alert-danger">{error}</div>
                  ) : (
                    ""
                  )}
                  {this.renderStart()}
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="box">
                  <h4>Tvoje výsledky</h4>
                  {this.renderStats()}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="row justify-content-center">
            <div className="col-md-5 col-sm-12">
              <a href="#leave" className="leave" onClick={(e) => this.leave(e)}>
                <img
                  src={process.env.PUBLIC_URL + "/ic-close.svg"}
                  alt="Odejít"
                />
                Odejít
              </a>
              <div className="box">{this.renderQuiz()}</div>
            </div>
          </div>
        )}
      </>
    );
  }
}
