import React from "react";
import ReactDOM from "react-dom";
import css from "./heading.scss";

export default class Heading extends React.Component {
  render() {
    const { children } = this.props;

    return <h1 className={css["heading-1"]}>{children}</h1>;
  }
}
