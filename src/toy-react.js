
const RENDER_TO_DOM = Symbol('renderToDom');

/**
 * 第一节课：
 *  目前是通过 DOMRender 函数中取 root 的过程才会真正开始渲染。
 *  在Component中不能取到真实的root(不能直接取到真实的DOM)，因此在这里会递归调用，直到所有的节点
 *  都成为 ElementWrapper 或 TextWrapper 的实例
 * 
 * 第二节课：
 * 一、要做什么改造？
 *  1.要在改变 state 的时候触发重渲染
 *  2.加上生命周期
 * 二、改造了什么，为什么要这么改造？
 *  1.不通过取root来渲染了，因为取 root 只能渲染一次，无法重渲染。
 *    所以需要一个函数(私有的)，每次重渲染调用它就行，并用 range API。
 *    为什么要用 range API 呢？【调用函数给它传一个位置，DOM中能操作位置的就是 range API】
 *    到这里，就具备了重新渲染的能力
 *  2.实现setState
 * 
 * 
 */
class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type);
  }
  setAttribute(name, value) {
    if (name.match(/^on([\s\S]+)$/)) {
      this.root.addEventListener(RegExp.$1.toLowerCase(), value);
    } else {
      if (name === 'className') {
        this.root.setAttribute('class', value);
      }
      this.root.setAttribute(name, value);
    }
  }
  appendChild(component) {
    const range = document.createRange();
    range.setStart(this.root, this.root.childNodes.length);
    range.setEnd(this.root, this.root.childNodes.length);
    component[RENDER_TO_DOM](range);
  }
  [RENDER_TO_DOM](range) {
    range.deleteContents();
    range.insertNode(this.root);
  }
}

class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content);
  }
  [RENDER_TO_DOM](range) {
    range.deleteContents();
    range.insertNode(this.root);
  }
}

class Component {
  constructor() {
    this.props = {
      children: [],
    };
    this._root = null;
    this._range = null;
  }
  setAttribute(name, value) {
    this.props[name] = value;
  }
  appendChild(component) {
    this.props.children.push(component);
  }
  // 在 private 语法出现之前，这是实现私有方法最好的办法
  [RENDER_TO_DOM](range) {
    this._range = range;
    this.render()[RENDER_TO_DOM](range);
  }
  rerender() {
    this._range.deleteContents();
    this[RENDER_TO_DOM](this._range);
  }
  setState(newState = {}) {
    if (Object.prototype.toString.call(newState).slice(8, -1) !== 'Object') {
      this.state = newState;
      this.rerender();
      return;
    }
    
    const merge = (oldState, newState) => ({...oldState, ...newState});
    this.state = merge(this.state, newState);
    this.rerender();
  }
}


function createElement(node, attributes, ...children) {
  let e;
  if (typeof node === 'string') {
    e = new ElementWrapper(node); // html标签
  } else {
    e = new node(attributes); // 组件
  }
  
  for (let i in attributes) {
    e.setAttribute(i, attributes[i]);
  }

  // children 可能是：字符串、createElement的返回值(组件实例或ElementWrapper实例)或者它们的数组
  const insertChildren = (children) => {
    for (let child of children) {
      if (['string', 'number'].includes(typeof child)) child = new TextWrapper(child);
      if ([null, undefined, false, true].includes(child)) continue;
      if (Array.isArray(child)) insertChildren(child);
      else e.appendChild(child);
    }
  };

  insertChildren(children);

  return e;
}

function DOMRender(component, rootElement) {
  const range = document.createRange();
  range.setStart(rootElement, 0);
  range.setEnd(rootElement, rootElement.childNodes.length);
  range.deleteContents();
  component[RENDER_TO_DOM](range);
}

export { createElement, Component, DOMRender };