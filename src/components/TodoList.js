import React, { Component } from 'react';

import { graphql } from 'react-apollo';
import * as compose from 'lodash.flowright';
import gql from 'graphql-tag';

class TodoList extends Component {
  state = {
    newTodoText: '',
  }

  addTodo = () => {
    const { newTodoText } = this.state;

    this.props.addTodo({
      variables: { text: newTodoText },
      update: (proxy, { data: { createTodo } }) => {
        this.props.todos.refetch();
      },
    })
  };

  renderTodoList = () => (
    <ul>
      { this.props.todos.allTodoes && this.props.todos.allTodoes.map(todo =>
        <li key={todo.id}>{todo.text}</li>
      )}
    </ul>
  )

  render() {
    const { todos } = this.props;

    return (
      <>
        { todos.loading
          ? <p>Carregando...</p>
          : this.renderTodoList() }

        <input
          type="text"
          value={this.state.newTodoText}
          onChange={e => this.setState({ newTodoText: e.target.value })}
        />
        <input type="submit" value="Criar" onClick={this.addTodo} />
      </>
    );
  }
}

const TodosQuery = gql`
  query {
    allTodoes {
      id
      text
      completed
    }
  }
`;

const TodoMutation = gql`
  mutation ($text: String!) {
    createTodo ( text: $text ) {
      id
      text
      completed
    }
  }
`;

export default compose(
  graphql(TodosQuery, { name: 'todos' }),
  graphql(TodoMutation, { name: 'addTodo' }),
)(TodoList);