

class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type);
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }
  appendChild(component) {
    this.root.appendChild(component.root);
  }
}

class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content);
  }
}

class Component {
  constructor() {
    this.props = Object.create(null); // 讲到 {}不够空，这样写才绝对空是什么意思？
    this.children = [];
    this._root = null;
  }
  setAttribute(name, value) {
    this.props[name] = value;
  }
  appendChild(component) {
    this.children.push(component);
  }
  get root() {
    if (!this._root) {
      this._root = this.render().root;
    }
    return this._root;
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

  const insertChildren = (children) => {
    for (let child of children) {
      if (typeof child === 'string') child = new TextWrapper(child);
      if (Array.isArray(child)) insertChildren(child);
      else e.appendChild(child);
    }
  };

  insertChildren(children);

  return e;
}

function DOMRender(component, rootElement) {
  rootElement.appendChild(component.root);
}

export { createElement, Component, DOMRender };