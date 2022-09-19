import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LogIn = () => {
  const [show, setShow] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

   const [loading, setLoading] = useState(false);

   //toast
   const toast = useToast();
   const nevigate = useNavigate();

  const handleClick = () => {
    setShow(!show);
  };

  const submitHandler = async() => {
    setLoading(true);
    if ( !email || !password ) {
      toast({
        title: "Enter all fields.",
        position: "top-right",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/user/login",
        {  email, password },
        config
      );
       
      toast({
        title: "Registration Successfull.",
        position: "top-right",
        status: "success",
        duration: 5000,
        isClosable: true,
      }); 

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      nevigate("/chat");

    } catch (err) {
      console.log(err);
      toast({
        title:"something wrong",
        description: err.response.data.message,
        position: "top",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl id="l-email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          value={email}
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="l-password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            value={password}
            type={show ? "text" : "password"}
            placeholder="Enter a password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button height="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        style={{ marginTop: 15 }}
        width="100%"
        colorScheme="teal"
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign In
      </Button>

      <Button
        style={{ marginTop: 15 }}
        width="100%"
        colorScheme="red"
        onClick={() => {
          setEmail("guest@gmail.com");
          setPassword("123456");
        }}
      >
        Login As Guest User
      </Button>
    </VStack>
  );
};

export default LogIn;
