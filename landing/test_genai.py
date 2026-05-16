from google.genai import types
print(dir(types.Part))
import inspect
print(inspect.signature(types.Part))
print(inspect.signature(types.Content))
