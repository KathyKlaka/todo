// creates an individual to do item with data from input field in the form
var TodoItem = React.createClass({
  render: function() {
    return (
        <li className="to-do-item">
          {this.props.task}
        </li>
    );
  }
});
// using jquery we get items from todos.json, loop through them and load them
var TodoBox = React.createClass({
  loadTodosFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  // gets data from the add form and posts it to the api which writes it to the json file using jquery
  handleTodoSubmit: function(todo) {
    var todos = this.state.data;
    todo.id = Date.now();
    var newTodos = todos.concat([todo]);
    this.setState({data: newTodos});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: todo,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: todos});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadTodosFromServer();
  },
  render: function() {   //display the whole to do box with all the components: list and form
    return (
      <div className="to-do-list-container">
        <h2>List of things to do</h2>
        <TodoList data={this.state.data} />
        <AddNewTodo onTodoSubmit={this.handleTodoSubmit} />
      </div>
    );
  }
});
// displays all the items in an unordered list
var TodoList = React.createClass({
  render: function() {
    var todoNodes = this.props.data.map(function(todo) {
      return (
        <TodoItem task={todo.task} key={todo.id}>
        </TodoItem>
      );
    });
    return (
      <ul className="to-do-list-container">
        {todoNodes}
      </ul>
    );
  }
});
// functionality that submits the form if any data is entered
var AddNewTodo = React.createClass({
  getInitialState: function() {
    return {task: ''};
  },
  handleTaskChange: function(e) {
    this.setState({task: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var task = this.state.task.trim();
    if (!task) {
      return;
    }
    this.props.onTodoSubmit({task: task});
    this.setState({task: ''});
  },
  // renders the form with the input field and submit btn and sets any data to states
  render: function() {
    return (
      <form className="form-inline add-to-do-items" onSubmit={this.handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          placeholder="I need to..."
          className="form-control"
          value={this.state.task}
          onChange={this.handleTaskChange}
        />
        <input type="submit" className="btn btn-primary form-control" value="Add task" />
        </div>
      </form>
    );
  }
});
// finaly attaches the whole thing to the element with the id of to-do-list in index html page
ReactDOM.render(
  <TodoBox url="/api/todos" />,
  document.getElementById('to-do-list')
);