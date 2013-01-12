#!/bin/env python
# encoding=utf-8

#用apt-get install python-tornado安装的不是最新，有bug。要用 pip install tornado
#
#此方案采用websocket实现

import os
import random

import tornado
import json
from tornado import web, autoreload, websocket, ioloop, options
from Config import Config
from datetime import timedelta
import logging

'''
    进入房间页面
'''
class EnterRoomHandler(web.RequestHandler):

    def get(self, room_name):
        self.render('index.html',
            config = Config,
            )



'''
    用websocket来与前端通信
'''
class GameSocketHandler(tornado.websocket.WebSocketHandler):

    socket_handlers = {}   #房间名-1:GameSocketHandler 一个房间每个人有一个值, 1用户订阅 room-1
    all_rooms = {}  # 房间名:GameRoom
    active_timeout = 600000 # 超时时间，超时后关闭房间

    def open(self):

        
        return

    def on_close(self):
        
        return True

    def on_message(self, message):
        
        return

    def allow_draft76(self):
        return True


urls = [
        (r"/room-(.{1,200})", EnterRoomHandler),
        # (r"/rooms", RoomListHandler),
        # (r"/", RoomListHandler),
        (r"/gamesocket", GameSocketHandler),
        ]

settings = dict(
        template_path = os.path.join(os.path.dirname(__file__), "templates"),
        static_path = os.path.join(os.path.dirname(__file__), "static"),
        cookie_secret = 'werwerwAW15Wwr-wrwe==dssdtfrwerter2t12',
        );

isLog = True

def main():
    # printrooms = tornado.ioloop.PeriodicCallback(printAllRooms, GameSocketHandler.active_timeout)
    # printrooms.start()
    tornado.options.parse_command_line() # -log_file_prefix=your complete path/test_log@8091.log
    application = web.Application(urls, **settings)
    application.listen(8888)
    # tornado.autoreload.start(tornado.ioloop.IOLoop.instance()) # add this to enable autorestart
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
