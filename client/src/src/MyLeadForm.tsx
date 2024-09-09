import React from "react"
import { useMutation } from '@tanstack/react-query';
import ky from 'ky';
import { Box, Button, FormControl, FormLabel, Input, Radio, RadioGroup, Stack, Text, useToast } from '@chakra-ui/react';
import { ChangeEvent, FormEvent, useState } from 'react';
import { Lead } from "./MyPage";


const createLead = async (newLead: Lead): Promise<string> => {
  return await ky.post('http://localhost:3000/leads', {
    json: newLead,
  }).text();
};

const MyLeadForm: React.FC = () => {
  const toast = useToast();

  // Use mutation hook from React Query
  // newLead will get passed in when i call mutation.mutate(myNewLead);
  const mutation = useMutation({
    mutationFn: (newLead: Lead) => {
      return createLead(newLead);
    },
  })
  // Form state
  const [lead, setLead] = useState<Lead>({
    name: '',
    email: '',
    mobile: '',
    status: '',
  });

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLead((prevLead) => ({
      ...prevLead,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate(lead);
  };

  return (
    <Box maxW="sm" mx="auto" mt={8}>
      <form onSubmit={handleSubmit}>
        <FormControl id="name" mb={4}>
          <FormLabel>Customer Name</FormLabel>
          <Input
            type="text"
            name="name"
            placeholder="Enter customer name"
            value={lead.name}
            onChange={handleChange}
            required
          />
        </FormControl>

        <FormControl id="email" mb={4}>
          <FormLabel>Customer Email</FormLabel>
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={lead.email}
            onChange={handleChange}
            required
          />
        </FormControl>

        <FormControl id="mobile" mb={4}>
          <FormLabel>Customer Mobile</FormLabel>
          <Input
            type="text"
            name="mobile"
            placeholder="Enter your mobile"
            value={lead.mobile}
            onChange={handleChange}
            required
          />
        </FormControl>

        <FormControl id="status" mb={4}>
          <FormLabel>Lead Status</FormLabel>
          <RadioGroup
            name="status"
            value={lead.status}
            onChange={(value) => setLead({ ...lead, status: value })}
          >
            <Stack direction="column">
              <Radio value="Expired">Expired</Radio>
              <Radio value="In Contact">In Contact</Radio>
              <Radio value="Lost">Lost</Radio>
              <Radio value="Won">Won</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>

        <Button
          type="submit"
          colorScheme="teal"
          isLoading={mutation.isPending}
          loadingText="Submitting"
        >
          Submit
        </Button>

        {mutation.isPending &&
          <Text>
            ...Adding Lead
          </Text>
        }
        {mutation.isError && (
          <Text color="red.500" mt={2}>
            Error: {mutation.error instanceof Error ? mutation.error.message : 'Unknown error'}
          </Text>
        )}

        {mutation.isSuccess && (
          <Text color="green.500" mt={2}>
            Lead created successfully!
          </Text>
        )}
      </form>
    </Box>
  );
};

export default MyLeadForm;
