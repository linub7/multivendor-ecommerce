interface Props {
  errorMessage?: string;
}

const ProductDetailsFormErrorMessageComponent = (props: Props) => {
  const { errorMessage } = props;
  return (
    <span className="text-sm font-medium text-destructive">{errorMessage}</span>
  );
};

export default ProductDetailsFormErrorMessageComponent;
