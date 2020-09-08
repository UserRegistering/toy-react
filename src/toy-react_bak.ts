
type ChildAppend = Component<any, any> | ElementWrapper | TextWrapper;

type CreateChildren<P> = string | string[] | Component<P, unknown> | Component<P, unknown>[] | ElementWrapper | ElementWrapper[];

class ElementWrapper {
  root: HTMLElement;

  constructor(type: string) {
    this.root = document.createElement(type);
  }
  setAttribute(name: string, value: any) {
    this.root.setAttribute(name, value);
  }
  appendChild(component: ChildAppend) {
    this.root.appendChild(component.root);
  }
}

class TextWrapper {
  root: Text;
  constructor(content: string) {
    this.root = document.createTextNode(content);
  }
}

class Component<Props, State> {
  props: Props;
  children: ChildAppend[];
  _root: HTMLElement;
  // @ts-ignore
  render: () => Component<unknown, unknown> | ElementWrapper;

  constructor(props: Props) {
    this.props = props; // Object.create(null) 讲到 {}不够空，这样写才绝对空是什么意思？
    this.children = [];
    // @ts-ignore
    this._root = null;
  }
  setAttribute(name: keyof Props, value: Props[keyof Props]) {
    this.props[name] = value;
  }
  appendChild(child: ChildAppend) {
    this.children.push(child);
  }
  get root(): HTMLElement {
    if (this._root === null) {
      this._root = this.render().root;
    }
    return this._root;
  }
}




function createElement<P>(node: string | Component<P, unknown>, attributes: P, ...children: CreateChildren<P>[]) {
  let e: ElementWrapper | Component<P, unknown>;
  if (typeof node === 'string') {
    e = new ElementWrapper(node); // html标签
  } else {
    // @ts-ignore
    e = new node<P, unknown>(attributes); // 组件
  }
  
  for (let i in attributes) {
    e.setAttribute(i, attributes[i]);
  }

  const insertChildren = (children: CreateChildren<P>[]) => {
    for (let child of children) {
      let c: CreateChildren<P> | TextWrapper = child;
      if (typeof child === 'string') {
        c = new TextWrapper(child);
      } else if (Array.isArray(child)) {
        insertChildren(child);
      } else {
        child
        e.appendChild(c as ChildAppend);
      }
    }
  };

  insertChildren(children);

  return e;
}

function DOMRender(component: Component<unknown, unknown> | ElementWrapper, rootElement: HTMLElement) {
  rootElement.appendChild(component.root);
}

export { createElement, Component, DOMRender };