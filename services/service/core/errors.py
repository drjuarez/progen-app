# stupid argument
def stupid_args_err(arg, function_name):
    raise ValueError("passed in a stupid ass arg {} to {}()".format(arg, function_name))

def raise_payload_validation(arg, val, model):
    raise ValueError("You sent in a bad Request Body: cannot post argument {} with value \"{}\" to {}".format(arg, val, model))

def missing_args(arg, call_to):
    raise ValueError("\"{}\" is missing in call to \"{}\"".format(arg, call_to))
