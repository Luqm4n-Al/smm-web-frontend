// data user managment tables 
import { gql } from '@apollo/client';

export const GET_DASHBOARD_USERS = gql`
  query CekListUser {
    users {
      data {
        id
        avatar
        email
        username
        role
        isActive
        createdAt
        lastLoginAt
      }
    }
  }
`;