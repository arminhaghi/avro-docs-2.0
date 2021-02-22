import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import Item from "./Item";
import AppLayout from "./components/AppLayout";
import { DataProvider } from "./context/data";
import "./App.css";

export default function App(): JSX.Element {
    return (
        <Router>
            <DataProvider>
                <Switch>
                    <Route path="/:item">
                        <AppLayout>
                            <Item />
                        </AppLayout>
                    </Route>
                    <Route path="/">
                        <AppLayout>
                            <h1>Welcome to AVRO Docs!</h1>
                            <p>Select a type from the side menu to start.</p>
                        </AppLayout>
                    </Route>
                </Switch>
            </DataProvider>
        </Router>
    );
}
