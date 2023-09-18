import { AltRoute, Poll, Whatshot } from '@mui/icons-material';
import { Fab, Stack, Tooltip } from '@mui/material';
import { Wildcard } from '../../shared/common';

interface WildcardButtonsProps {
  usedWildcards: string[] | undefined;
  handleSelectWildcard: (wildcard: Wildcard) => void;
}

const WildcardButtons = ({
  usedWildcards,
  handleSelectWildcard,
}: WildcardButtonsProps) => (
  <Stack
    direction={{ xs: 'column', md: 'row' }}
    spacing={2}
    justifyContent={'center'}
    margin={'8%'}
  >
    <Tooltip title="Eliminate two wrong answers" placement="top">
      <Fab
        variant="extended"
        color="primary"
        onClick={() => handleSelectWildcard('halfChance')}
        disabled={usedWildcards?.includes('halfChance')}
        sx={{ fontSize: '1rem' }}
      >
        <AltRoute sx={{ mr: 1 }} />
        Half Chance
      </Fab>
    </Tooltip>
    <Tooltip
      title="Double your points. A wrong answer will subtract points for the question"
      placement="top"
    >
      <Fab
        variant="extended"
        color="primary"
        onClick={() => handleSelectWildcard('booster')}
        disabled={usedWildcards?.includes('booster')}
        sx={{ fontSize: '1rem' }}
      >
        <Whatshot sx={{ mr: 1 }} />
        Booster
      </Fab>
    </Tooltip>
    <Tooltip
      title="Make a decision based on the votes of all participants"
      placement="top"
    >
      <Fab
        variant="extended"
        color="primary"
        onClick={() => handleSelectWildcard('poll')}
        disabled={usedWildcards?.includes('poll')}
        sx={{ fontSize: '1rem' }}
      >
        <Poll sx={{ mr: 1 }} />
        Answer Poll
      </Fab>
    </Tooltip>
  </Stack>
);

export default WildcardButtons;
