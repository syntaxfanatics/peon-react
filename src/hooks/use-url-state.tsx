import React, { useContext, useState, useEffect, useMemo, } from 'react';
import PropTypes from 'prop-types';
import { routerPropTypes } from '../prop-types/router-prop-types';
import { $TS_FIX_ME } from '@syntaxfanatics/peon';
import { History } from 'history';
import { useIsMounted } from './use-is-mounted';
import { InferPropTypes } from '../typings/infer-prop-types';


const urlStateProviderPropTypes = {
  router: routerPropTypes.isRequired,
  children: PropTypes.node.isRequired,
};
const urlStateProviderDefaultProps = {
  //
}

type UrlStateProviderPropTypes = InferPropTypes<typeof urlStateProviderPropTypes, typeof urlStateProviderDefaultProps>;

type UrlStateContextValue = null | {
  history: History;
  searchParams: URLSearchParams;
};

const UrlStateContext = React.createContext<UrlStateContextValue>(null);

// interface UrlStateProviderPropTypes { router: UrlStateProviderPropTypes; }


/**
* @description
* UrlStateProvider
*
* @param props
*/
export const UrlStateProvider: React.FC<UrlStateProviderPropTypes> = ({ children, router }) => {
  const { location } = router;
  const isMounted = useIsMounted();

  const [urlStateContextValue, setUrlStateContextValue] = useState(() => ({
    history: router.history as $TS_FIX_ME<History>,
    searchParams: new URLSearchParams(location.search)
  }));

  // when search changes, dispatch change to urlState
  // effectively listens for changes via history push/replace
  // (handled by react-router...)
  useEffect(
    () => void (isMounted && setUrlStateContextValue({
      history: router.history as $TS_FIX_ME<History>,
      searchParams: new URLSearchParams(location.search),
    })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search, router.history]
  );

  return (
    <UrlStateContext.Provider value={urlStateContextValue}>
      {children}
    </UrlStateContext.Provider>
  );
};

UrlStateProvider.propTypes = urlStateProviderPropTypes;
UrlStateProvider.defaultProps = urlStateProviderDefaultProps;

// const getUnescapedCharRegex = (char: string) => new RegExp(`(?<!\\\\${char})`);
// const getUnescapedCharAndRestRegex = (char: string) => new RegExp(`(?<!\\\\)${char}(.+)`);
// const getEscapedCharRegex = (char: string) => new RegExp(`\\${char}`);

type UrlStateType = Record<string, string> | { [index: string]: string };


/**
 * @description
 * Map a string of urlSubParameters to an object
 *
 * @param encodedTargetUrlParam
 * @param washUrlState
 * @param options
 */
function singleUrlParamStringToObject<UrlState extends UrlStateType>(
  encodedTargetUrlParam: string,
  washUrlState: (incomingUrlState: Record<string, string>) => UrlState,
): UrlState {
  // 1 -> decode sub param (string) section
  const decodedTargetUrlParam = decodeURIComponent(encodedTargetUrlParam);
  // 2 -> break into params entries
  const subParamObject = new URLSearchParams(decodedTargetUrlParam);
  const encodedSubParamEntries = Array.from(subParamObject.entries());
  // 3 -> decode params entries
  const decodedSubParamEntries: [string, string][] = encodedSubParamEntries.map(([key, value]) => [
    decodeURIComponent(key),
    decodeURIComponent(value)
  ]);

  // 4 -> serialise decoded params to object
  const unwashedUrlState = Object.fromEntries(decodedSubParamEntries);

  // 5 -> wash results
  const urlState = washUrlState(unwashedUrlState);

  return urlState;
}

/**
 * @description
 *
 * @param urlState
 */
function singleUrlParamObjectToString<UrlState extends UrlStateType>(
  urlState: UrlState,
  defaults?: null | UrlState,
): string {

  // 5 <- remove any defaults
  const urlStateWithoutDefaults = defaults
    ? Object.fromEntries(Object.entries(urlState).filter(([k, v]) => !(k in defaults && defaults[k] === v)))
    : { ...urlState };

  // 4 <- get decoded entries
  const decodedSubParamEntries = Object.entries(urlStateWithoutDefaults);
  // 3 <- encode params entries
  const encodedSubParamEntries = decodedSubParamEntries.map(([key, value]) => [
    encodeURIComponent(key),
    encodeURIComponent(value),
  ]);
  // 2 <- turn into object
  const subParamObject = new URLSearchParams(encodedSubParamEntries);
  // 1 <- encode sub param (string) section
  const encodedParamString = encodeURIComponent(subParamObject.toString());

  return encodedParamString;
}


/**
 * @description
 * Listen to specified sections of the query string (aka urlState) for changes
 *
  https://perishablepress.com/stop-using-unsafe-characters-in-urls/
  https://stackoverflow.com/questions/2748022/urlencoding-safe-delimiter
 *
 * @param targetUrlParamKey parameter of the url to subscribe to
 * @param options
 */
export function useUrlState<UrlState extends UrlStateType>(
  targetUrlParamKey: string,
  washUrlState: (dirtyUrlState: Record<string, string>) => UrlState,
  defaults?: null | UrlState,
) {
  const urlStateContextValue = useContext(UrlStateContext);
  if (!urlStateContextValue) throw ReferenceError('Could not connect to urlState - no UrlStateProvider detected');
  const { history, searchParams: currentSearchParams } = urlStateContextValue;

  const targetUrlParamString = currentSearchParams.get(targetUrlParamKey) || '';

  const decodedUrlParamState = useMemo(() => {
    return singleUrlParamStringToObject(
      targetUrlParamString,
      washUrlState,
    );
  }, [targetUrlParamString, washUrlState]);

  /**
   * @description
   * Update the parameter of the url state object
   *
   * @param oldUrlState
   * @param incomingUrlState
   */
  function updateSearchFromDecodedObject(incomingUrlStateSlice: Partial<UrlState>, pushOrReplace: 'PUSH' | 'REPLACE') {
    const incomingDecodedObject = incomingUrlStateSlice;
    const newDecodedObject = { ...decodedUrlParamState };

    // mutate the newDecodedObject in place
    Object
      .entries(incomingDecodedObject)
      // TODO: verify whether the filtering is desirable
      .forEach(([k, v]: [keyof UrlState, UrlState[string] | undefined]) => (v !== undefined) && (newDecodedObject[k] = v));

    // stringify sub params safely
    const newEncodedUrlParamString = singleUrlParamObjectToString(newDecodedObject, defaults);

    // clone and update full search params, inserting the updated sub param
    const nextSearchParams = new URLSearchParams(currentSearchParams);
    nextSearchParams.set(targetUrlParamKey, newEncodedUrlParamString);

    // update search
    if (pushOrReplace === 'PUSH') history.push({ search: nextSearchParams.toString() });
    else if (pushOrReplace === 'REPLACE') history.replace({ search: nextSearchParams.toString() });
    else throw new TypeError(`invalid pushOrReplace: ${pushOrReplace}`);
  }

  return { urlState: decodedUrlParamState, setUrlState: updateSearchFromDecodedObject, };
}
