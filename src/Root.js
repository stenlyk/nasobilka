import React from "react";
import Start from "./Start.js";
import Quiz from "./Quiz.js";
import { reactLocalStorage } from "reactjs-localstorage";

export default class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: { num: [1, 2, 3, 4], skils: { nas: true, del: true } },
      submited: false,
      error: "",
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

  renderStart() {
    return (
      <Start
        onChange={(e) => this.handleChange(e)}
        onSubmit={(e) => this.handleSubmit(e)}
        selected={this.state.selected}
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

  renderStat(stat) {
    const nasArray = stat.nas;
    const delArray = stat.del;
    const nas = Object.keys(nasArray);
    const del = Object.keys(delArray);
    console.log(nas);
    return (
      <>
        <div class="row">
          <div class="col">
            <h5>Násobilka</h5>
            {nas.map((i) => (
              <p>
                Násobilka {i}: {nasArray[i]}x
              </p>
            ))}
          </div>
          <div class="col">
            <h5>Dělení</h5>
            {del.map((i) => (
              <p>
                Dělení {i}: {delArray[i]}x
              </p>
            ))}
          </div>
        </div>
      </>
    );
  }

  renderStats() {
    const wrong = reactLocalStorage.getObject("wrong", []);
    const correct = reactLocalStorage.getObject("correct", []);
    let statsC = { nas: {}, del: {} };
    let statsW = { nas: {}, del: {} };

    correct.map(
      (elm) =>
        (statsC[elm.method][elm.num2] = statsC[elm.method][elm.num2]
          ? statsC[elm.method][elm.num2] + 1
          : 1)
    );
    wrong.map(
      (elm) =>
        (statsW[elm.method][elm.num2] = statsW[elm.method][elm.num2]
          ? statsW[elm.method][elm.num2] + 1
          : 1)
    );

    return (
      <>
        <div className="alert alert-success">
          <h4 className="alert-heading">Správně</h4>
          {this.renderStat(statsC)}
        </div>
        <div className="alert alert-danger">
          <h4 className="alert-heading">Chybně</h4>
          {this.renderStat(statsW)}
        </div>
      </>
    );
  }

  render() {
    const submited = this.state.submited;
    const error = this.state.error;
    return (
      <>
        <div className="row">
          <div className="col">
            {error !== "" ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
              ""
            )}
            {submited ? this.renderQuiz() : this.renderStart()}
          </div>
        </div>
        {!submited ? (
          <>
            <div className="row">
              <div className="col">
                <h4>Tvoje výsledky</h4>
              </div>
            </div>
            {this.renderStats()}
          </>
        ) : (
          ""
        )}
      </>
    );
  }
}
