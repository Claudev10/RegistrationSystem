import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  VStack,
  Text,
  Button,
  Flex,
  IconButton,
  Tooltip,
  useToast
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import axios from "axios";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const MainPage = () => {
  const [produtos, setProdutos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProdutoId, setEditingProdutoId] = useState(null);
  const [editingProduto, setEditingProduto] = useState(null);
  useEffect(() => {
    fetchProdutos();
  }, []);

  const baseURL = "http://localhost:5000/produtos"

  const toast = useToast('')

  const fetchProdutos = async () => {
    try {
      const response = await axios.get(baseURL);
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseURL}/${id}`);
      fetchProdutos();      
      toast({
        title: 'Produto deletado!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: "top",
        variant: "subtle",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
      });
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
    }
  };

  const handleAddProduto = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };



  const handleProdutoConfirm = async (produto) => {
    try {
      await axios.post(baseURL, produto);
      fetchProdutos();
      setIsModalOpen(false);
      toast({
        title: 'Produto adicionado!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: "top",
        variant: "subtle",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
      });
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
    }
  };

  const handleEdit = (id) => {
    const produto = produtos.find(produto => produto.id === id);
    setEditingProduto(produto);
    setEditingProdutoId(id);
    setIsModalOpen(true);
  };

  const handleProdutoEditConfirm = async (produto) => {
    try {
      await axios.put(`${baseURL}/${editingProdutoId}`, produto);
      fetchProdutos();
      setIsModalOpen(false);
      setEditingProduto(null);
      setEditingProdutoId(null);
      toast({
        title: 'Produto editado!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: "top",
        variant: "subtle",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
      });
    } catch (error) {
      console.error("Erro ao editar produto:", error);
    }
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/");
  };

  return (
    <Box p="4">
      <Header handleLogout={handleLogout} />
      <Button
        leftIcon={<AddIcon />}
        colorScheme="teal"
        mb="4"
        onClick={handleAddProduto}
      >
        Adicionar Produto
      </Button>
      <VStack align="stretch" spacing="4">
        {produtos.map((produto) => (
          <Box key={produto.id} borderWidth="1px" borderRadius="md" p="4" width="100%">
            <Flex align="center">
              <Heading as="h2" size="md" flexGrow="1">
                {produto.nome}
              </Heading>
              <Tooltip label="Editar" hasArrow placement="top">
                <IconButton
                  icon={<EditIcon />}
                  aria-label="Editar"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    handleEdit(produto.id);
                  }}
                />
              </Tooltip>
              <Tooltip label="Apagar" placement="top">
                <IconButton
                  icon={<DeleteIcon />}
                  aria-label="Apagar"
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(produto.id)}
                />
              </Tooltip>
            </Flex>
            <Text fontSize="sm" mt="2">
              <strong>Código:</strong> {produto.codigo}
            </Text>
            <Text fontSize="sm">
              <strong>Tipo:</strong> {produto.tipo}
            </Text>
            <Text fontSize="sm">
              <strong>Descrição:</strong> {produto.descricao}
            </Text>
          </Box>
        ))}
      </VStack>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onConfirm={editingProdutoId ? handleProdutoEditConfirm : handleProdutoConfirm}
          produto={editingProduto}
        />
      )}
    </Box>
  );
};

export default MainPage;
