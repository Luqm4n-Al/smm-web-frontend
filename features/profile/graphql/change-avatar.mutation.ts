import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

export const CHANGE_AVATAR_MUTATION = gql`
  mutation ChangeAvatar($file: Upload!) {
    changeAvatar(file: $file)
  }
`;

export const useChangeAvatarMutation = () => {
  return useMutation<{ changeAvatar: string }, { file: File }>(CHANGE_AVATAR_MUTATION);
};