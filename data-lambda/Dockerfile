FROM public.ecr.aws/lambda/python:3.9

WORKDIR /var/task

RUN python3.9 -m pip install requests "urllib3<2" nba_api -t python/lib/python3.9/site-packages/