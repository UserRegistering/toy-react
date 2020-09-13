
import { createElement, Component, DOMRender } from './toy-react';
import Game from './demo';

class Show extends Component {
  render() {
    return <div>Show 组件{this.props.text}</div>
  }
}

class MyComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      a: 0,
    };
  }

  render() {
    const { id, name, title, children } = this.props;
    return (
      <div id={id} name={name} title={title}>
        My Component
        <Show text={123} />
        <button onClick={(e) => { this.setState({ a: this.state.a + 1 }) }}>Click Me</button>
        {this.state.a.toString()}
        {children}
      </div>
    );
  }
}


const a = (
  <MyComponent id="d1" title="text" name="divName">
    <div>spanText1</div>
    <div>spanText2</div>
    <Game />
  </MyComponent>
);

DOMRender(a, document.getElementById('root'));

console.log(a);
