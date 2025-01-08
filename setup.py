from setuptools import setup, find_packages

setup(
    name="soundboard",
    version="0.0.2",
    packages=find_packages(),
    install_requires=[
        'customtkinter==5.2.2',
        'sounddevice==0.5.1',
        'soundfile==0.13.0',
        'playsound==1.2.2'
    ]
) 