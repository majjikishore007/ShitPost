import { Vote } from '../entities/Vote';
import DataLoader from 'dataloader';

// [{postId: 5, userId: 10}]
// [{postId: 5, userId: 10, value: 1}]
export const createVoteLoader = () =>
  new DataLoader<{ postId: number; userId: number }, Vote | null>(
    async (keys) => {
      const Votes = await Vote.findByIds(keys as any);
      const VoteIdsToVote: Record<string, Vote> = {};
      Votes.forEach((Vote) => {
        VoteIdsToVote[`${Vote.userId}|${Vote.postId}`] = Vote;
      });

      return keys.map((key) => VoteIdsToVote[`${key.userId}|${key.postId}`]);
    }
  );
