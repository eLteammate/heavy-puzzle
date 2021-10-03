import React, {useState} from 'react';
import {Box, Button, Center, ChakraProvider, Fade, ListItem, UnorderedList} from "@chakra-ui/react";
import Canvas from "./components/Canvas";
import {Provider} from "react-redux";
import {store} from "./store/store";


function App() {
    const [showTutorial, setShowTutorial] = useState(true);

    return (
        <Provider store={store}>
            <ChakraProvider>
                <Canvas/>
                <Fade in={showTutorial} unmountOnExit>
                    <Center
                        pos="fixed" top="0" left="0"
                        w="100vw" h="100vh" bg="#ddd"
                    >
                        <Box m={2}>
                            <UnorderedList>
                                <ListItem>Перетягивайте детали пазла друг к другу</ListItem>
                                <ListItem>Когда правильные кусочки рядом - они объединяться</ListItem>
                                <ListItem>Чем больше кусочек, тем сложнее его тащить</ListItem>
                                <ListItem>Объединяйтесь с друзьями, чтобы собрать весь пазл!</ListItem>
                            </UnorderedList>
                            <Button onClick={() => setShowTutorial(false)}>
                                Вперед!
                            </Button>
                        </Box>
                    </Center>
                </Fade>
            </ChakraProvider>
        </Provider>
    );
}


export default App;
