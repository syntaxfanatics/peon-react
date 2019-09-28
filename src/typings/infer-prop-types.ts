import PropTypes from 'prop-types';

/**
 * @description
 * Allows TS inference of PropTypes within React components
 *
 * @see https://dev.to/busypeoples/notes-on-typescript-inferring-react-proptypes-1g88
 *
 * @example
 * const componentPropTypes = {
 *  propA: PropTypes.string.isRequired,
 *  propB: PropTypes.number,
 * }
 *
 * const componentDefaultProps = {
 *  propB: 5,
 * }
 *
 * type ComponentPropTypes = InferPropTypes<typeof componentPropTypes, typeof componentDefaultProps>;
 *
 * class MyComponent1 extends React.Component<ComponentPropTypes> {
 *  ...
 * }
 *
 * const MyComponent1: React.FC<ComponentPropTypes> = () => {
 *  ...
 * }
 */
export type InferPropTypes<TPropTypes, TDefaultProps = {}, TProps = PropTypes.InferProps<TPropTypes>> = {
  [K in keyof TProps]: K extends keyof TDefaultProps ? TProps[K] | TDefaultProps[K] : TProps[K];
};
