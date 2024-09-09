import React from "react";
import { Box, Button, StackDivider, Table, Tbody, Td, Thead, Tr, VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import { useEffect, useState } from "react";
import MyLeadForm from "./MyLeadForm";

export type Lead = {
  name: string;
  email: string;
  mobile: string;
  status: string;
}

type LeadsResponse = Lead[];


// This is the method to get the leads from the api
const getLeads = async () => {
  try {
    const response = await ky.get("http://localhost:3005/leads?n=10").json<LeadsResponse>()
    return response;
  } catch (e) {
    return Promise.reject(e);
  }
}

const generateLeadsRows = (leads: LeadsResponse): React.ReactNode[] => {
  const result = leads.map((lead: Lead) => {
    return <Tr>
      <Td>{lead.name}</Td>
      <Td>{lead.email}</Td>
      <Td>{lead.mobile}</Td>
      <Td>{lead.status}</Td>
    </Tr>
  })

  return result;
}

// This is a method that just returns the useQuery response
// I find it cleaner in terms of housekeeping to not have it in the component body
// in here you can also do any additional steps before returning the useQuery object,
// for example you can pass in an isDisabled prop to the useQuery,
// or even do some manipulation to the data returned
const useGetLeadsQuery = () => {
  return useQuery({ queryKey: ["getLeads"], queryFn: getLeads })
}

const MyPage: React.FC = () => {
  const getLeadsQuery = useGetLeadsQuery()
  const [leads, setLeads] = useState<React.ReactNode[] | null>(null);

  useEffect(() => {
    if (getLeadsQuery.isSuccess && getLeadsQuery.data) {
      setLeads(generateLeadsRows(getLeadsQuery.data));
    }
  }, [getLeadsQuery.isSuccess, getLeadsQuery.data])

  useEffect(() => {
    if (getLeadsQuery.isError) {
      console.log(getLeadsQuery.error);
    }
  }, [getLeadsQuery.isError])

  const refreshTable = (e: React.MouseEvent) => {
    getLeadsQuery.refetch();
  }

  return (
    <Box>
      <VStack
        divider={<StackDivider />}
      >
        <Box>
          <Table variant={"simple"}>
            <Thead>
              <Tr>
                <Td>Name</Td>
                <Td>Email</Td>
                <Td>Mobile</Td>
                <Td>Status</Td>
              </Tr>
            </Thead>
            <Tbody>
              {
                leads ?? leads
              }
            </Tbody>
          </Table>
          <Button onClick={refreshTable} >Refresh Table</Button>
        </Box>
        <hr />
        <Box >
          <MyLeadForm />
        </Box>
      </VStack>
    </Box>
  )
}

export default MyPage;
