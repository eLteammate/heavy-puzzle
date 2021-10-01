import React from 'react';
import {ChakraProvider} from "@chakra-ui/react";
import Canvas from "./components/Canvas";
import {Provider} from "react-redux";
import {store} from "./store/store";


function App() {
    return (
        <Provider store={store}>
            <ChakraProvider>
                <Canvas/>
            </ChakraProvider>
        </Provider>
    );
}


export default App;
