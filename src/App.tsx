import {
    HashRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import All from "./All";
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
                            <All />
                        </AppLayout>
                    </Route>
                </Switch>
            </DataProvider>
        </Router>
    );
}
