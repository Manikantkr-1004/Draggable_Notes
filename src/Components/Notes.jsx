import {
  Box,
  Button,
  Flex,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, BellIcon, CloseIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { AddNotes } from "./AddNotes";

export function Notes() {
  const [notes, setNotes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [draggedNote, setDraggedNote] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    const availableNotes = localStorage.getItem("notes");
    availableNotes ? setNotes(JSON.parse(availableNotes)) : setNotes([]);
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const handleModalOpen = () => {
    onOpen();
  };

  const handleMouseDown = (e, id, pinned) => {
    if (pinned) {
      return;
    } else {
      setDraggedNote(id);
      setDragStart({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (draggedNote !== null) {
      const x = e.clientX - dragStart.x;
      const y = e.clientY - dragStart.y;

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === draggedNote
            ? { ...note, x: note.x + x, y: note.y + y }
            : note
        )
      );

      setDragStart({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const handleMouseUp = () => {
    setDraggedNote(null);
    setDragStart({ x: 0, y: 0 });
  };

  const handleEdit = (id) => {
    if (editId === id) {
      setEditId(null);
    } else {
      setEditId(id);
    }
  };

  const handleEditTitle = (e, id) => {
    let editNote = notes.map((ele) =>
      ele.id === id ? { ...ele, title: e.target.value } : ele
    );
    setNotes(editNote);
  };

  const handleDel = (id) => {
    let delNote = notes.filter((ele) => ele.id !== id);
    setNotes(delNote);
    toast({
      title: "Note Delete Successfully",
      isClosable: true,
      duration: 2000,
      position: "bottom",
      status: "success",
    });
  };

  const handlePin = (id) => {
    let pinNote = notes.map((ele) =>
      ele.id === id ? { ...ele, pinned: !ele.pinned } : ele
    );
    setNotes(pinNote);
  };

  return (
    <>
      <Box w="100%" h="100vh" position="relative" bg="#DCB83E" overflow="auto">
        <Button
          onClick={handleModalOpen}
          title="Add Note"
          zIndex="9999"
          position="absolute"
          right="10px"
          top="10px"
          transition="all ease 0.2s"
          _active={{ transform: "scale(0.8)" }}
        >
          <AddIcon />
        </Button>

        {notes.map((ele, ind) => (
          <Box
            onMouseDown={(e) => handleMouseDown(e, ele.id, ele.pinned)}
            onMouseMove={(e) => handleMouseMove(e)}
            onMouseUp={handleMouseUp}
            position="absolute"
            zIndex={ele.pinned ? 1000 + ind : ind}
            left={ele.pinned ? 30 * ind + "px" : ele.x + "px"}
            top={ele.pinned ? 30 * ind + "px" : ele.y + "px"}
            cursor="move"
            w="230px"
            p="15px 8px 7px 15px"
            height="auto"
            bg="#FFFF3B"
            border="1px solid #000"
            key={ele.id}
          >
            {editId === ele.id && (
              <Textarea onChange={(e) => handleEditTitle(e, ele.id)} h="100%">
                {ele.title}
              </Textarea>
            )}
            {editId !== ele.id && <Text>{ele.title}</Text>}
            <Flex mt="5px" w="100%" gap="2px" justifyContent="space-between">
              <Button
                onClick={() => handleEdit(ele.id)}
                bg="white"
                border="1px solid #e3e3e3"
                transition="all ease 0.2s"
                _active={{ transform: "scale(0.9)" }}
              >
                {editId === ele.id ? "Ok" : "Edit"}
              </Button>
              <Button
                onClick={() => handleDel(ele.id)}
                title="Delete Note"
                bg="white"
                border="1px solid #e3e3e3"
                transition="all ease 0.2s"
                _active={{ transform: "scale(0.9)" }}
              >
                <CloseIcon />
              </Button>
              <Button
                onClick={() => handlePin(ele.id)}
                title="Pin Note"
                bg={ele.pinned ? "#DCB83E" : "#fff"}
                border="1px solid #e3e3e3"
                transition="all ease 0.2s"
                _active={{ transform: "scale(0.9)" }}
              >
                <BellIcon />
              </Button>
            </Flex>
          </Box>
        ))}
      </Box>

      <AddNotes
        isOpen={isOpen}
        onClose={onClose}
        notes={notes}
        setNotes={setNotes}
      />
    </>
  );
}
