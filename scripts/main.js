//  original js
//  var P1Symbol = "X
//  var P2Symbol = "O"
//  var currentTurn = P1Symbol

//  var board = document.querySelector('.board')
//  board.addEventListener('click', function(e) {
//    e.target.innerHTML = currentTurn
//    currentTurn = currentTurn === P1Symbol ? P2Symbol : P1Symbol

//  })

// component created with createClass
// must have render method to return markup
// called by reactDOM.render(component, renderElement)
// greeting1 == JSX, react element transpiled on fly to js by babel
// (jsx {embed js}) -- round brackets stop auto ; insertion
// jsx " for strings, {} for expressions but not both in same attribute
// jsx camelCase naming --try babel syntax scheme in editor
// jsx compiled to createElement calls by babel == react elements for render
//     many elements to 1 component (fn)
// react elements are immutable, once created can't change children or attributes
//     like single frame in movie == ui at point in time
//     they have type eg h1 and properties eg className:greeting, children:'hello world!'
// components: independant, resuable piece of ui, props in, elements out
//     note components start with capital, else dom tag <Welcome.. vs <div..
//     represent any html compoents and children
// calling setState schedules update to component & dependants
// reactDOM uses camelCase for html attribute naming eg tabIndex

// classes can be declared (class x)
//   or as named (var x = class x {}) or unnamed (var x = class ()) expressions
// they have constructors (use super to call parent constructor)




// basic react syntax example
// component definition is straight js fn returning markup
//    fn must be 'pure' (not modify inputs and return same output for given inputs)
function Welcome (props) {
  return <p>Hello, World! (and {props.userName} with basic syntax)</p>
}

const element = <Welcome userName="Bob" />
// call element's component fn with attributes as props
// render resulting markup to dom
ReactDOM.render(element, document.getElementById('root0'));

// better syntax creates component as class

// returns markup in render fn
var Welcome2 = React.createClass({
  render: function() {
    return (
       <p>Hello again, World! (and {this.props.userName} with better syntax)</p>
    )
  }
});

// components must return single root element
ReactDOM.render(
  <div>
    <Welcome2 userName="Bob"/>
    <Welcome2 userName="Bill"/>
  </div>,
  document.getElementById('root1')
);

// basic way of doing timed updates
var Greeting2 = React.createClass({
  render: function() {
    return (
      <p>{this.props.message}</p>
    );
  }
});

function render2() {
  var messages = ['Hello, World', 'Hello, Planet', 'Hello, Universe'];
  var randomMessage = messages[Math.floor((Math.random() * 3))];

  ReactDOM.render(
    <Greeting2 message={randomMessage}/>,
    document.getElementById('root2')
  );
}

setInterval(render2, 5 * 1000);

// better if all logic encapsulated within component class
class Clock extends React.Component {
  render() {
    return (
      <p>Time: {new Date().toLocaleTimeString()}.</p>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('rootclock')
);

// can pass in vars and use this.props to get to them
class Clock2 extends React.Component {
  render() {
    return (
      <p>Time2: {this.props.date.toLocaleTimeString()}.</p>
    );
  }
}

ReactDOM.render(
  <Clock2 date={new Date()}/>,
  document.getElementById('rootclock2')
);

// or class can maintain own private state, initalised by constructor
// note jsx{js} relationship and pass of props to base constructor super(props)
class Clock3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }
  render() {
    return (
      <p>Time3: {this.state.date.toLocaleTimeString()}.</p>
    );
  }
}

ReactDOM.render(
  <Clock3 />,
  document.getElementById('rootclock3')
);

// plus lifecycle hooks == events. rendered == mounting, removed == unmounting
// note jsx{js} relationship and pass of props to base constructor super(props)
// reactdom render call for <Clock4 /> creates clock4 class (calling constructor) and calls class.render
// react updates dom with class.render output markup
// dom update with clock4 markup triggers didmount event which sets up tick function to be called every second
// every second, browser calls tick function which updates state
// react checks for state changes and calls render for latest markup
// timer stopped if clock4 ever removed from dom
// state rules: do not update directly (always use setState)
//       state updates are batched and applied out of order
//       so updates of state/prop based on state/prop do not work
//       force dependency by using setState(fn()) syntax whereby fn is always provided correct previous state
//       see https://facebook.github.io/react/docs/state-and-lifecycle.html

class Clock4 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }
  componentDidMount() {
    // set timer going, keep timerID as class var for removal in unmount event
    // this.props set by react and this.state reserved, but can add own this.vars as required
    // () throwaway function
    this.timerID = setInterval( () => { this.tick() }, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  tick() {
    this.setState({ date: new Date() });
  }
  render() {
    return (
      <span>Time3: {this.state.date.toLocaleTimeString()}. </span>
    );
  }
}

ReactDOM.render(
  <div>
    <Clock4 />
    <Clock4 />
    <Clock4 />
  </div>,
  document.getElementById('rootclock4')
);

// next - events (toggle button)
// if to change rendered output (null is not rendered)
// generate lists of markup and helper keys for rendering
// forms, text areas, select lists

// skipped to lifting up (sharing) state example
class BoilingVerdict extends React.Component {
  render() {
    if (this.props.celsius >= 100) {
      return (<p>Water will boil!!</p>);
    }
    return (<p>Water not boiling</p>);
  }
}

class Cooker extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: '10'};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    return (
      <fieldset>
        <legend>Enter Temp in C:</legend>
        <input value={temperature} onChange={this.handleChange} />
        <BoilingVerdict celsius={parseFloat(temperature)}/>
      </fieldset>
    );
  }
}

ReactDOM.render(
  <div>
    <Cooker />
  </div>,
  document.getElementById('cooker')
);

// example of 2 components lifting state up to source of truth
// common ancestor parent becomes controlled component
// child calls fn on parent to change shared prop

const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit'
};

function toCelsius (fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}

function tryConvert(temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000
  return rounded.toString();
}

class CookerScale extends React.Component {
  render() {
    if (this.props.celsiusTemperature >= 100) {
      return (<p>Water boiling!!</p>);
    }
    return (<p>Water not boiling</p>);
  }
}

class CookerKnob extends React.Component {
  constructor(props) {
    super(props);
    this.newTemperatue = this.newTemperatue.bind(this);
    this.state = {temperature: '-1'};
  }

  newTemperatue(e) {
    this.props.changeTemperatue(e.target.value);
  }

  render() {
    const temperature = this.props.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter Temp in {scaleNames[scale]}:</legend>
        <input value={temperature} onChange={this.newTemperatue} />
      </fieldset>
    );
  }
}

class Cooker2 extends React.Component {
  constructor(props) {
    super(props);
    this.changeCelsiusTemperatue = this.changeCelsiusTemperatue.bind(this);
    this.changeFahrenheitTemperatue = this.changeFahrenheitTemperatue.bind(this);
    this.state = {scale: 'c', temperature: '5'};
  }

  changeCelsiusTemperatue(newTemperature) {
    this.setState({scale: 'c', temperature: newTemperature});
  }

  changeFahrenheitTemperatue(newTemperature) {
    this.setState({scale: 'f', temperature: newTemperature});
  }

  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const celsiusTemperature = scale == 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheitTemperature = scale == 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <div>
        <fieldset>
          <legend>Cooker</legend>
          <CookerKnob scale="c" temperature={celsiusTemperature} changeTemperatue={this.changeCelsiusTemperatue} />
          <CookerKnob scale="f" temperature={fahrenheitTemperature} changeTemperatue={this.changeFahrenheitTemperatue} />
          <CookerScale celsiusTemperature={celsiusTemperature}/>
        </fieldset>
      </div>
    );
  }
}

ReactDOM.render(
  <Cooker2 />,
  document.getElementById('cooker2')
);

// #############################################################
// Thinking in React Example
// https://facebook.github.io/react/docs/thinking-in-react.html
//##############################################################
class ProductCategoryRow extends React.Component {
  render() {
    return (<tr><th colSpan="2">{this.props.category}</th></tr>);
  }
}

class ProductRow extends React.Component {
  render() {
    var name = this.props.product.stocked ?
      this.props.product.name :
      <span style={{color: 'red'}}>
        {this.props.product.name}
      </span>;
    return (
      <tr>
        <td>{name}</td>
        <td>{this.props.product.price}</td>
      </tr>
    );
  }
}

class ProductTable extends React.Component {
  render() {
    var rows = [];
    var lastCategory = null;
    console.log(this.props.inStockOnly)
    this.props.products.forEach((product) => {
      if (product.name.indexOf(this.props.filterText) === -1 || (!product.stocked && this.props.inStockOnly)) {
        return;
      }
      if (product.category !== lastCategory) {
        rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
      }
      rows.push(<ProductRow product={product} key={product.name} />);
      lastCategory = product.category;
    });
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleFilterTextInputChange = this.handleFilterTextInputChange.bind(this);
    this.handleInStockInputChange = this.handleInStockInputChange.bind(this);
  }

  handleFilterTextInputChange(e) {
    this.props.onFilterTextInput(e.target.value);
  }

  handleInStockInputChange(e) {
    this.props.onInStockInput(e.target.checked);
  }

  render() {
    return (
      <form>
        <input
          type="text"
          placeholder="Search..."
          value={this.props.filterText}
          onChange={this.handleFilterTextInputChange}
        />
          <input
            type="checkbox"
            checked={this.props.inStockOnly}
            onChange={this.handleInStockInputChange}
          />
          {' '}
          Only show products in stock
      </form>
    );
  }
}

class FilterableProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
      inStockOnly: false
    };

    this.handleFilterTextInput = this.handleFilterTextInput.bind(this);
    this.handleInStockInput = this.handleInStockInput.bind(this);
  }

  handleFilterTextInput(filterText) {
    this.setState({
      filterText: filterText
    });
  }

  handleInStockInput(inStockOnly) {
    this.setState({
      inStockOnly: inStockOnly
    })
  }

  render() {
    return (
      <div>
        <fieldset>
          <legend>thinking in react example</legend>
            <SearchBar
              filterText={this.state.filterText}
              inStockOnly={this.state.inStockOnly}
              onFilterTextInput={this.handleFilterTextInput}
              onInStockInput={this.handleInStockInput}
            />
            <ProductTable
              products={this.props.products}
              filterText={this.state.filterText}
              inStockOnly={this.state.inStockOnly}
            />
        </fieldset>
      </div>
    );
  }
}


var PRODUCTS = [
  {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
  {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
  {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
  {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
  {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
  {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];

ReactDOM.render(
  <FilterableProductTable products={PRODUCTS} />,
  document.getElementById('rrcontainer')
);

// #############################################################
// Redux example (router?)
// http://jpsierens.com/simple-react-redux-application/
//##############################################################

// Action Creators
let nextTodoId = 0;
const addTodo = (task) => {
    return { type: 'ADD_TODO', id: nextTodoId++, task };
};

let nextAuthorId = 0;
const addAuthor = (name, role) => {
    return { type: 'ADD_AUTHOR', id: nextAuthorId++, name, role, };
};

//undestand this simple redux, convert to redux-react lib & look at routes

// Reducers
const todos = (currentState = [], action) => {
    switch(action.type){
        case 'ADD_TODO':
            const nextState = [
                ...currentState,
                {
                    id: action.id,
                    task: action.task,
                    completed: false
                }
            ];
            return nextState;
            break;
        default:
            return currentState;
    }
};

const authors = (currentState = [], action) => {
    switch(action.type) {
        case 'ADD_AUTHOR':
            const nextState = [
                ...currentState,
                {
                    id: action.id,
                    name: action.name,
                    role: action.role
                }
            ];
            return nextState;
            break;
        default:
            return currentState;
    }
};

const todoApp = (currentState = {}, action) => {
    return {
        todos: todos(currentState.todos, action),
        authors: authors(currentState.authors, action),
    }
};

// destructure { pattern } syntax == extract requested item(s) (Redux.createStore)
const { createStore } = Redux;
const store = createStore(todoApp);



// #############################################################
// React-Redux example (router?)
// http://jpsierens.com/simple-react-redux-application/
//##############################################################
