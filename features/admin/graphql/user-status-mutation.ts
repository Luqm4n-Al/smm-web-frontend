import { gql } from '@apollo/client';

export const ACTIVATE_USER =
  gql`
    mutation ActivateUser(
      $id: ID!
    ) {
      activateUser(id: $id) {
        id
        isActive
      }
    }
  `;

export const DEACTIVATE_USER =
  gql`
    mutation DeactivateUser(
      $userId: ID!
    ) {
      deactivateUser(
        userId: $userId
      )
    }
  `;