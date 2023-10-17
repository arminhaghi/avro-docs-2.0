import {
    HashRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import Home from "./Home";
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
                        <Home />
                    </Route>
                </Switch>
            </DataProvider>
        </Router>
    );
}
