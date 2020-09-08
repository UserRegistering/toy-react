
import { createElement, Component, DOMRender } from './toy-react';

class MyComponent extends Component {

  constructor(props) {
    super(props);
    console.log('constructor', props);
    
  }

  render() {
    const { id, name, title } = this.props;
    return (
      <div id={id} name={name} title={title}>
        My Component
        {this.children}
      </div>
    );
  }
}


const a = (
  <MyComponent id="d1" title="text" name="divName">
    <div>spanText1</div>
    <div>spanText2</div>
  </MyComponent>
);

DOMRender(a, document.getElementById('root'));

console.log(a);
