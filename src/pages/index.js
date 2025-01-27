import React, { useState, useEffect } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { FaPen } from "react-icons/fa6";
import { IoMdCheckmark } from "react-icons/io";
import { time } from "../utils/time";
import { HiOutlineClock } from "react-icons/hi";

import {
  Box,
  Heading,
  Input,
  Button,
  VStack,
  HStack,
  Text,
  Flex,
  Icon,
  Grid,
  GridItem,
} from "@chakra-ui/react";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState("null");
  const [editedTask, setEditedTask] = useState("");

  // Dodaj nalogo v seznam nalog, če vnos ni prazen. To preprečuje dodajanje praznih nalog.

  const addTask = () => {
    if (task.trim()) {
      setTasks([
        ...tasks,
        { text: task, completed: false, timeCreated: new Date().toISOString() },
      ]);
      setTask("");
    }
  };
  // Nastavi stanje za urejanje naloge: shrani indeks naloge in njeno besedilo,
  // da omogoči prikaz vnosnega polja za urejanje.
  const startEditing = (index) => {
    setIsEditing(index);
    setEditedTask(tasks[index].text); // Nastavi trenutno besedilo naloge
  };
  // Posodobi besedilo naloge na določenem indeksu in končaj urejanje.
  // Po končanem urejanju se izklopi način urejanja in izprazni besedilo.
  const saveTask = (index) => {
    if (editedTask.trim() === "") {
      alert("Task cannot be empty!");
      return;
    }
    setTasks((prevTasks) =>
      prevTasks.map((t, i) => (i === index ? { ...t, text: editedTask } : t))
    );
    setIsEditing("null");
    setEditedTask("");
  };

  // Preklopi stanje naloge med opravljeno in neopravljeno.
  // Posodobi seznam nalog tako, da se ustrezno spremeni status 'completed'.
  const toggleTask = (index) => {
    setTasks((prevTasks) =>
      prevTasks.map((t, i) =>
        i === index ? { ...t, completed: !t.completed } : t
      )
    );
  };

  // Odstrani nalogo iz seznama na določenem indeksu.
  // Filtriraj seznam nalog in ohrani le tiste, ki niso označene za izbris.
  const deleteTask = (index) => {
    if (window.confirm("Are you sure you want to delete this task?"))
      setTasks(tasks.filter((_, i) => i !== index));
  };
  // Filtriraj naloge na podlagi iskalnega niza, pri čemer ignoriraš velikost črk.
  // To omogoča uporabniku iskanje nalog po besedilu.
  const filteredTasks = tasks.filter((t) =>
    t.text.toLowerCase().includes(search.toLowerCase())
  );
  // Ob zagonu aplikacije preberi shranjene naloge iz `localStorage`,
  // če naloge niso shranjene, inicializiraj seznam kot prazen.
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const parsedTasks = savedTasks.map((task) => ({
      ...task,
      timeCreated: new Date(task.timeCreated),
    }));

    setTasks(parsedTasks);
  }, []);
  // Ob vsaki spremembi nalog shrani posodobljen seznam nalog v `localStorage`.
  // To omogoča, da naloge ostanejo shranjene tudi po osvežitvi strani.
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  return (
    <Flex align="top" justify="center" h="100vh" bg="gray.900">
      <Box p={5} maxW="500px" w="100%">
        <Heading textStyle="5xl" color="white" mb={10} textAlign="center">
          Whats your plan for today ? 📋✅
        </Heading>

        <VStack spacing={4}>
          <HStack>
            {/* Vnosna polja za nalogo in gumb za dodajanje naloge */}
            <Input
              borderRadius="md"
              w="70%"
              borderColor="orange.500"
              color="white"
              placeholder="Got Something To Do?"
              _placeholder={{ color: "grey" }}
              value={task}
              onChange={(e) => setTask(e.target.value)}
              borderWidth="2px"
              size="lg"
            />
            <Button
              alignContent="center"
              borderRadius="md"
              _hover={{ bg: "orange.600" }}
              bg="orange.500"
              colorScheme="teal"
              onClick={addTask}
              size="lg"
              w="25%"
            >
              Add task
            </Button>
            {/* Ime iskalnega polja */}
          </HStack>
          <Input
            borderRadius="md"
            borderColor="orange.500"
            color="white"
            placeholder="Type to search your tasks"
            _placeholder={{ color: "grey" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            borderWidth="2px"
            size="lg"
            w={{ base: "100%", md: "72%" }}
          />
          {/* Prikaz nalog */}
          <VStack mt={10} spacing={2} align="stretch" w="100%">
            {filteredTasks.map((t, index) => (
              <HStack
                borderRadius="md"
                key={index}
                justify="space-between"
                p={2}
                borderWidth="2px"
                color="white"
                borderColor="orange.500"
              >
                {/* Če je naloga v načinu urejanja*/}
                {isEditing === index ? (
                  <HStack w="100%">
                    <Input
                      value={editedTask}
                      onChange={(e) => setEditedTask(e.target.value)}
                      color="white"
                      borderColor="orange.500"
                    />
                    <Button
                      size="sm"
                      bg="orange.500"
                      _hover={{ bg: "orange.600" }}
                      onClick={() => saveTask(index)}
                    >
                      Update
                    </Button>
                  </HStack>
                ) : (
                  // Običajen prikaz naloge
                  <>
                    <VStack align="start" spacing={1} w="80%">
                      <Text
                        fontWeight="bold"
                        color={t.completed ? "gray.500" : "white"}
                        textDecoration={t.completed ? "line-through" : "none"}
                      >
                        {t.text}
                      </Text>
                      <HStack>
                        <Icon
                          as={HiOutlineClock}
                          boxSize={4}
                          color="gray.400"
                        />
                        <Text color="gray.400" fontSize="sm" fontStyle="italic">
                          {time(t.timeCreated)}
                        </Text>
                      </HStack>
                    </VStack>
                    <HStack>
                      <Icon
                        as={IoMdCheckmark}
                        boxSize={6}
                        cursor="pointer"
                        color={t.completed ? "green.500" : "white"}
                        _hover={{
                          color: t.completed ? "red.600" : "orange.600",
                        }}
                        onClick={() => toggleTask(index)}
                      />
                      <Icon
                        as={FaPen}
                        boxSize={5}
                        cursor="pointer"
                        color="white"
                        onClick={() => startEditing(index)}
                        _hover={{ color: "orange.600" }}
                      />
                      <Icon
                        as={HiOutlineTrash}
                        boxSize={5}
                        color="white"
                        cursor="pointer"
                        _hover={{ color: "orange.600" }}
                        onClick={() => deleteTask(index)}
                      />
                    </HStack>
                  </>
                )}
              </HStack>
            ))}
          </VStack>
        </VStack>
      </Box>
    </Flex>
  );
}
