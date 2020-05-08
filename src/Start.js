// @flow
import React from "react";
import { type Selected } from "./Root";
export const nums = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
];

export const basicMathNums = ["0-10", "0-20", "0-100", "100-999", "1000-9999"];

export const publicUrl = process.env.PUBLIC_URL || "";

type Props = {
  onChange: any,
  onSubmit: any,
  doublePoints: any,
  selected: Selected,
  total: number,
  wrong: number,
  fixed: number,
};

type State = {
  num: Array<number>,
  basicMathNums: Array<string>,
  skils: {
    sci: string,
    odc: string,
    nas: string,
    del: string,
  },
  delMode: {
    normal: string,
    modulo: string,
  },
};

export default class Start extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      num: nums,
      basicMathNums,
      skils: {
        sci: "Sčítání",
        odc: "Odčítání",
        nas: "Násobení",
        del: "Dělení",
      },
      delMode: {
        normal: "Dělení bez zbytku",
        modulo: "Dělení se zbytkem",
      },
    };
  }

  renderNumber(num: number) {
    const checked = this.props.selected.num.indexOf(num);
    return (
      <React.Fragment key={num}>
        <input
          type="checkbox"
          name="num"
          value={num}
          checked={checked !== -1 ? true : false}
          id={"input" + num}
          onChange={this.props.onChange}
        />
        <label className="checkbox" htmlFor={"input" + num}>
          {num}
        </label>
      </React.Fragment>
    );
  }

  renderNumberRange(num: string) {
    const checked = this.props.selected.basicMathNum.indexOf(num);
    const label = num.split("-");
    return (
      <React.Fragment key={num}>
        <input
          type="radio"
          name="basicMathNum"
          value={num}
          checked={checked !== -1 ? true : false}
          id={"basicMathNum" + num}
          onChange={this.props.onChange}
        />
        <label className="checkbox" htmlFor={"basicMathNum" + num}>
          {parseFloat(label[1]) < 100 ? "do " + label[1] : label[1]}
        </label>
      </React.Fragment>
    );
  }

  renderSkils(val: string, key: string) {
    // console.log(this.props.selected.skils[key] === true);
    return (
      <React.Fragment key={key}>
        <input
          type="checkbox"
          name={key}
          value={true}
          checked={this.props.selected.skils[key] === true ? true : false}
          id={"input" + key}
          onChange={this.props.onChange}
        />
        <label className="checkbox" htmlFor={"input" + key}>
          {val}
        </label>
      </React.Fragment>
    );
  }

  renderDividingOptions(val: string, key: string) {
    // console.log(this.props.selected.skils[key] === true);
    return (
      <React.Fragment key={key}>
        <input
          type="checkbox"
          name={key}
          value={true}
          checked={this.props.selected.delMode === key ? true : false}
          id={"input" + key}
          onChange={this.props.onChange}
        />
        <label className="checkbox" htmlFor={"input" + key}>
          {val}
        </label>
      </React.Fragment>
    );
  }

  render() {
    return (
      <div className="start">
        <form onSubmit={this.props.onSubmit}>
          <h4>Co chceš trénovat?</h4>
          <div className="justify-content-between">
            {Object.keys(this.state.skils).map((key) =>
              this.renderSkils(this.state.skils[key], key)
            )}
          </div>
          {this.props.selected.skils["del"] === true ? (
            <div className="justify-content-between">
              {Object.keys(this.state.delMode).map((key) =>
                this.renderDividingOptions(this.state.delMode[key], key)
              )}
            </div>
          ) : null}
          {this.props.selected.skils["nas"] === true ||
          this.props.selected.skils["del"] === true ? (
            <>
              <h4>S jakými čísly chceš trénovat násobení a dělení?</h4>
              <div className="numbers justify-content-between">
                <input
                  type="checkbox"
                  value={true}
                  name="all"
                  checked={
                    this.props.selected.num.length === this.state.num.length
                      ? true
                      : false
                  }
                  onChange={this.props.onChange}
                  id="inputAll"
                />
                <label className="checkbox all" htmlFor={"inputAll"}>
                  Vše
                </label>
                {this.state.num.map((num) => this.renderNumber(num))}
              </div>
            </>
          ) : null}
          {this.props.selected.skils["sci"] === true ||
          this.props.selected.skils["odc"] === true ? (
            <>
              <h4>S jakými čísly chceš trénovat sčítání a odčítání?</h4>
              <div className="basicMathNums justify-content-between">
                {this.state.basicMathNums.map((num) =>
                  this.renderNumberRange(num)
                )}
              </div>
            </>
          ) : null}
          <hr />
          <div className="row align-items-center">
            <div className="col light-text">
              {this.props.total} dokončených příkladů
            </div>
            <div className="col text-right">
              <button type="submit" className="btn">
                <img src={publicUrl + "/ic-next-white.svg"} alt="start" /> Začít
                počítat
              </button>
            </div>
          </div>
          {this.props.wrong >= 10 ? (
            <>
              <hr className="m-top" />
              <div className="row align-items-center">
                <div className="col-6 light-text">
                  {this.props.wrong} chyb
                  <br />
                  {this.props.fixed} opraveno
                </div>
                <div className="col-6 text-right">
                  <button
                    type="button"
                    onClick={this.props.doublePoints}
                    className="btn btn-scondary"
                  >
                    <img src={publicUrl + "/ic-next.svg"} alt="start" /> Opravit
                    si chyby
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </form>
      </div>
    );
  }
}
