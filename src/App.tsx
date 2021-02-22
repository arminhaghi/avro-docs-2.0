import { PageHeader, Tag, Table } from "antd";
import AppLayout from "./components/AppLayout";
import { DataProvider } from "./context/data";
import "./App.css";

export default function App(): JSX.Element {
    return (
        <DataProvider>
            <AppLayout>
                <h1>Welcome to AVRO Docs!</h1>
                <p>Select a type from the side menu to start.</p>
            </AppLayout>
        </DataProvider>
    );
}


// import React from 'react';
// import logo from './logo.svg';
// import { Button } from 'antd';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//       <Button type="primary">Button</Button>
//     </div>
//   );
// }

// export default App;
