import PropTypes from 'prop-types';

// type Location<S = LocationState>
export const locationPropTypes = {
  pathname: PropTypes.string.isRequired,
  search: PropTypes.string.isRequired,
  state: PropTypes.string,
  hash: PropTypes.string.isRequired,
  key: PropTypes.string,
};

// type: History<HistoryLocationState = LocationState>
export const historyPropTypes = {
  length: PropTypes.number.isRequired,
  action: PropTypes.string.isRequired,
  location: PropTypes.shape(locationPropTypes).isRequired,
  push: PropTypes.func.isRequired,
  replace: PropTypes.func.isRequired,
  go: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  block: PropTypes.func.isRequired,
  listen: PropTypes.func.isRequired,
  createHref: PropTypes.func.isRequired,
};

// type matchPropTypes<Params>
export const matchPropTypes = {
  params: PropTypes.objectOf(PropTypes.string).isRequired,
  isExact: PropTypes.bool.isRequired,
  path: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
}

// RouteChildrenProps<params, S = H.LocationState>
export const routerPropTypes = PropTypes.shape({
  history: PropTypes.shape(historyPropTypes).isRequired,
  location: PropTypes.shape(locationPropTypes).isRequired,
  match: PropTypes.shape(matchPropTypes),
});