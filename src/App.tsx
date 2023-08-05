import { SearchForm } from './components';
import { CreateTodoButton } from './components/CreateTodo';
import { TodoTable } from './components/TodoList';

function App() {
    return (
        <>
            <SearchForm />
            <CreateTodoButton />
            <TodoTable />
        </>
    );
}

export default App;
