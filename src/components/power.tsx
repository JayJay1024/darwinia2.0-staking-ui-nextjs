import { GET_LATEST_STAKING_REWARDS } from "@/config";
import { useApp, useStaking } from "@/hooks";
import { formatBlanace, getChainConfig, prettyNumber } from "@/utils";
import { formatDistanceStrict } from "date-fns";
import { useQuery } from "graphql-hooks";
import Image from "next/image";
import { getAddress } from "viem";
import { useAccount } from "wagmi";

interface Reward {
  id: string;
  amount: string;
  blockNumber: number;
  blockTime: string;
}

interface RewardNode {
  nodes: Reward[];
}

interface StakingRecord {
  rewards: RewardNode;
}

interface QueryVariables {
  accountAddress: string;
  itemsCount: number;
}

interface QueryResult {
  stakingRecord: StakingRecord;
}

export default function Power() {
  const { power } = useStaking();
  const { activeChain } = useApp();
  const { address } = useAccount();
  const { data: rewardData } = useQuery<QueryResult, QueryVariables>(GET_LATEST_STAKING_REWARDS, {
    variables: { accountAddress: address ? getAddress(address) : "", itemsCount: 9 },
  });

  const chainConfig = getChainConfig(activeChain);

  return (
    <div className="flex flex-1 flex-col gap-5 bg-primary p-5">
      {/* power */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-middle">
          <Image alt="Icon of Power" src="/images/power.svg" width={30} height={42} />
          <span className="text-3xl font-bold text-white">Power</span>
        </div>
        <span className="text-3xl font-bold text-white">{prettyNumber(power)}</span>
      </div>

      {/* reward */}
      <div className="flex flex-col gap-middle bg-component p-5">
        <span className="text-sm font-bold text-white">Latest Staking Rewards</span>
        <div className="h-[1px] shrink-0 bg-white/20" />
        <div className="flex h-[6rem] flex-col overflow-y-auto">
          {rewardData?.stakingRecord.rewards.nodes.length ? (
            <div className="flex flex-col gap-small">
              {rewardData.stakingRecord.rewards.nodes.map(({ id, amount, blockTime }) => (
                <div className="flex items-center justify-between" key={id}>
                  <span className="text-sm font-light text-white">
                    {formatBlanace(BigInt(amount), chainConfig.nativeToken.decimals)} {chainConfig.nativeToken.symbol}
                  </span>
                  <span className="text-sm font-light text-white">{toTimeAgo(blockTime)}</span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-sm font-light text-white/50">No rewards yet</span>
          )}
        </div>
      </div>

      {/* see detail */}
      <div className="inline-block">
        <span className="text-xs font-light text-white">See detailed staking rewards in </span>
        <a
          target="_blank"
          href={chainConfig.explorer.url}
          rel="noopener"
          className="font-sans text-xs font-normal text-white underline transition-opacity hover:opacity-80 active:opacity-60"
        >
          {chainConfig.explorer.name}→
        </a>
      </div>
    </div>
  );
}

function toTimeAgo(time: string) {
  return formatDistanceStrict(time.endsWith("Z") ? new Date(time) : new Date(`${time}Z`), Date.now(), {
    addSuffix: true,
  });
}
