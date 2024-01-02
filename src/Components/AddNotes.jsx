import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormLabel,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";

export function AddNotes({ isOpen, onClose, notes, setNotes }) {
  const [title, setTitle] = useState("");
  const toast = useToast();

  const handleAdd = (e) => {
    e.preventDefault();

    let newId = notes[notes.length - 1]?.id + 1 || 0;
    let x = notes[notes.length - 1]?.x + 5 || 400;
    let y = notes[notes.length - 1]?.y + 5 || 10;

    let newData = { id: newId, title, pinned: false, x, y };
    setNotes((prev) => [...prev, newData]);
    toast({
      title: "New Note Added Successfully",
      isClosable: true,
      duration: 2000,
      status: "success",
      position: "bottom",
    });
    setTitle("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center" fontWeight="bold" color="blue">
          Add New Note
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleAdd}>
            <FormLabel>Note Title *</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              required
            />
            <br />
            <br />
            <Button
              type="submit"
              transition="all ease 0.2s"
              _active={{ transform: "scale(0.9)" }}
              variant="unstyled"
              bg="blue"
              color="white"
              w="100%"
            >
              Add Note
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
