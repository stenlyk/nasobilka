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
          <h4>S jakými čísli chceš počítat?</h4>
          <div className="justify-content-between">
            <input
              type="checkbox"
              value={true}
              checked={false}
              onChange={this.props.onChange}
              id="inputAll"
            />
            <label className="checkbox" htmlFor={"inputAll"}>
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
              {this.props.total} dokončených testů
            </div>
            <div className="col text-right">
              <input
                type="submit"
                className="btn"
                value="    Začít počítat    "
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}
