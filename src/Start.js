import React from "react";

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      skils: { nas: "Násobení", del: "Dělení" },
    };
  }

  renderNumber(num) {
    const checked = this.props.selected.num.indexOf(num);
    return (
      <div key={num} className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="checkbox"
          name="num"
          value={num}
          checked={checked !== -1 ? true : false}
          id={"input" + num}
          onChange={this.props.onChange}
        />
        <label className="form-check-label" htmlFor={"input" + num}>
          {num}
        </label>
      </div>
    );
  }

  renderSkils(val, key) {
    console.log(this.props.selected.skils[key] === true);
    return (
      <div key={key} className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="checkbox"
          name={key}
          value={true}
          checked={this.props.selected.skils[key] === true ? true : false}
          id={"input" + key}
          onChange={this.props.onChange}
        />
        <label className="form-check-label" htmlFor={"input" + key}>
          {val}
        </label>
      </div>
    );
  }

  render() {
    return (
      <div>
        <form onSubmit={this.props.onSubmit}>
          <div className="row">
            <div className="col">
              {this.state.num.map((num) => this.renderNumber(num))}
            </div>
          </div>
          <div className="row">
            <div className="col">
              {Object.keys(this.state.skils).map((key) =>
                this.renderSkils(this.state.skils[key], key)
              )}
            </div>
          </div>
          <div className="row">
            <div className="col">
              <input type="submit" className="btn btn-primary" value="Start" />
            </div>
          </div>
        </form>
      </div>
    );
  }
}
