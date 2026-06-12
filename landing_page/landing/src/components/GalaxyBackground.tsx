import StarField from './StarField';

export const GalaxyBackground = (): JSX.Element => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 bg-black"
    >
      <StarField />
    </div>
  );
};
