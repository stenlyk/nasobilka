import React from "react";
import Start, { nums } from "./Start.js";
import Quiz from "./Quiz.js";
import { reactLocalStorage } from "reactjs-localstorage";

export default class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: { num: [1, 2, 3, 4], skils: { nas: true, del: true } },
      submited: false,
      error: "",
      num: nums,
      levels: { 10: "paper", 50: "bronze", 200: "silver", 500: "gold" },
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
      this.setState({ submited: true });
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
    let result = ["paper", 10];

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
    const nasArray = stats.nas;
    const delArray = stats.del;

    const num = this.state.num;
    //console.log(this.getLevel(0));
    let level = {};
    let progressC = 0;
    let progressW = 0;

    return (
      <>
        <div className="row stats">
          <div className="col-md-6 col-sm-12">
            <h4>Násobení</h4>
            {num.map((i) => {
              level = this.getLevel(nasArray[i]["correct"]);
              progressC = (nasArray[i]["correct"] / level[1]) * 100 + "%";
              progressW = (nasArray[i]["wrong"] / level[1]) * 100 + "%";
              return (
                <React.Fragment key={i}>
                  <div className={"row align-items-center " + level[0]}>
                    <div className="col-2">
                      <div className="badge">{i}</div>
                    </div>
                    <div className="col">
                      <div className="progress">
                        <div
                          className="progress-bar"
                          style={{ width: progressC }}
                        >
                          {nasArray[i]["correct"]} / {level[1]}
                        </div>
                        <div
                          className="progress-bar bg-danger"
                          style={{ width: progressW }}
                        >
                          {nasArray[i]["wrong"]}
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
          <div className="col-md-6 col-sm-12">
            <h4>Dělení</h4>
            {num.map((i) => {
              level = this.getLevel(delArray[i]["correct"]);
              progressC = (delArray[i]["correct"] / level[1]) * 100 + "%";
              progressW = (delArray[i]["wrong"] / level[1]) * 100 + "%";
              return (
                <React.Fragment key={i}>
                  <div className={"row align-items-center " + level[0]}>
                    <div className="col-2">
                      <div className="badge">{i}</div>
                    </div>
                    <div className="col">
                      <div className="progress">
                        <div
                          className="progress-bar"
                          style={{ width: progressC }}
                        >
                          {delArray[i]["correct"]} / {level[1]}
                        </div>
                        <div
                          className="progress-bar bg-danger"
                          style={{ width: progressW }}
                        >
                          {delArray[i]["wrong"]}
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
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
        <div className="row text-left align-items-center">
          <div className="col-1 paper">
            <div className="badge">1</div>
          </div>
          <div className="col">Začátečník</div>
          <div className="col-1 bronze">
            <div className="badge">1</div>
          </div>
          <div className="col">Bronzová úroveň</div>
          <div className="col-1 silver">
            <div className="badge">1</div>
          </div>
          <div className="col">Stříbrná úroveň</div>
          <div className="col-1 gold">
            <div className="badge">1</div>
          </div>
          <div className="col">Zlatá úroveň</div>
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
