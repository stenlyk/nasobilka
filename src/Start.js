import React from "react";

export const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num: nums,
      skils: { nas: "Násobení", del: "Dělení" },
    };
  }

  renderNumber(num) {
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

  renderSkils(val, key) {
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

  render() {
    return (
      <div className="start">
        <form onSubmit={this.props.onSubmit}>
          <h4>S jakými čísly chceš počítat?</h4>
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
          <h4>Co chceš trénovat?</h4>
          <div className="justify-content-between">
            {Object.keys(this.state.skils).map((key) =>
              this.renderSkils(this.state.skils[key], key)
            )}
          </div>
          <hr />
          <div className="row align-items-center">
            <div className="col light-text">
              {this.props.total} dokončených příkladů
            </div>
            <div className="col text-right">
              <button type="submit" className="btn">
                <img
                  src={process.env.PUBLIC_URL + "/ic-next-white.svg"}
                  alt="start"
                />{" "}
                Začít počítat
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
                    <img
                      src={process.env.PUBLIC_URL + "/ic-next.svg"}
                      alt="start"
                    />{" "}
                    Opravit si chyby
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
