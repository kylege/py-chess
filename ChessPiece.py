#encoding=utf-8

from ChessMove import ChessMove

class BasicReturn():
    result = True
    code   = 0
    msg    = ''
    data   = None

    def __init__(self, result=True, code=0, msg='', data=None):
        self.result = result
        self.code = code
        self.msg = msg
        self.data = data

'''
    棋子的属性
'''
class ChessPiece():

    CHESS_RED = 1
    CHESS_BLACK = 2

    def __init__(self, name, color):
        
        self.name = name
        self.color = color
        

class ChessGame():

    '''
        物理坐标与ChessPiece对象对应关系，key为 行-列, value 为ChessPiece对象
    '''
    PiecesMap = {}

    """下棋相关，保存数据等"""
    def __init__(self):
        self.last_move_color = None
        self.isGameOver = False
        my_piece_pos = [
            [6,0,'bing'],
            [6,2, 'bing'],
            [6,4, 'bing'],
            [6,6, 'bing'],
            [6,8, 'bing'],
            [7,1,'pao'],
            [7,7,'pao'],
            [9,0,'che'],
            [9,1,'ma'],
            [9,2,'xiang'],
            [9,3,'shi'],
            [9,4,'king'],
            [9,5,'shi'],
            [9,6,'xiang'],
            [9,7,'ma'],
            [9,8,'che'],
        ]
        for piece in my_piece_pos:
            key = str(piece[0])+'-'+str(piece[1])
            self.PiecesMap[key] = ChessPiece(piece[2], ChessPiece.CHESS_RED)  #服务器这边存的，是红方在下面的这种
        his_piece_pos = [
            [0,0,'che'],
            [0,1,'ma'],
            [0,2,'xiang'],
            [0,3,'shi'],
            [0,4,'king'],
            [0,5,'shi'],
            [0,6,'xiang'],
            [0,7,'ma'],
            [0,8,'che'],
            [2,1,'pao'],
            [2,7,'pao'],
            [3,0,'bing'],
            [3,2,'bing'],
            [3,4,'bing'],
            [3,6,'bing'],
            [3,8,'bing'],
        ]
        for piece in his_piece_pos:
            key = str(piece[0])+'-'+str(piece[1])
            self.PiecesMap[key] = ChessPiece(piece[2], ChessPiece.CHESS_BLACK) 

    '''
        将棋子移到指定格子上
    '''
    def moveTo(self, user_color, row1, col1, row2, col2):
        if user_color == self.last_move_color:
            return {'result':False, 'msg':'对方还没走棋'}
        org_key = "%d-%d" % (row1,col1)
        if not org_key in self.PiecesMap:
            return BasicReturn(False,-1,'没有选择棋子')

        move = ChessMove(self, row1, col1, row2, col2)
        if not move.canMove():
            return BasicReturn(False,-1,'走法不合规则')

        key = "%d-%d" % (row2, col2)
        if key in self.PiecesMap and self.PiecesMap[key].name == u'king': # 判断是不是王挂了，结束游戏
            self.isGameOver = True

        self.PiecesMap[key] = self.PiecesMap[org_key]
        del self.PiecesMap[org_key]
        return BasicReturn(True)

class GameRoom():
	STATUS_WAITING = 0;
	STATUS_GOING   = 1
	STATUS_END     = 2

	def __init__(self, room_name, piece_id):
		self.chess_game = ChessGame()
		self.status = self.STATUS_WAITING
		self.room_name = room_name
		self.user_piece_ids = set([piece_id])
        