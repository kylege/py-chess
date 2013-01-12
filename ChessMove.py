#!encoding=utf-8
import math
'''
	游戏实例chess_game从一个地方下子到另一个地方
'''
class ChessMove():

	"""下棋动作，判断是否按规则走"""
	def __init__(self, chess_game, row1,col1,row2,col2):
		self.ChessPiece = chess_game  # 这个参数其实是ChessGame实例
		self.row1 = row1
		self.col1 = col1
		self.row2 = row2
		self.col2 = col2

	'''
		不能吃自己
	'''
	def _canMove_eat(self):
		key = "%d-%d" % (self.row2, self.col2)
		if not self.ChessPiece.PiecesMap[key]: return True
		chessp2 = self.ChessPiece.PiecesMap[key]
		chessp1 = self.ChessPiece.PiecesMap[ "%d-%d" % (self.row1, self.col1) ]
		if chessp1.color == chessp2.color: return False
		return True

	'''
		炮
	'''
	def _canMove_pao(self):
		if self.row1 != self.row2 and self.col1 != self.col2: return False
		total = 0 # 中间隔了几个人

		if self.row1 == self.row2:
			start = self.col2 if self.col1 > self.col2 else self.col1
			end = self.col1 if self.col1 > self.col2 else self.col2
			for i in range(start+1, end):
				ikey = "%d-%d" % (self.row1, i)
				if self.ChessPiece.PiecesMap[ikey]: total = total+1
		elif self.col1 == self.col2:
			start = self.row2 if self.row1 > self.row2 else self.row1
			end = self.row1 if self.row1 > self.row2 else self.row2
			
			for i in range(start+1, end):
				ikey = "%d-%d" % (i, self.col1)
				if self.ChessPiece.PiecesMap[ikey]: total = total+1
		if total > 1: return False

		key = "%d-%d" % (self.row2, self.col2)
		if total == 1 and not self.ChessPiece.PiecesMap[key]: return False   # 不能打空火炮
		if total == 0 and self.ChessPiece.PiecesMap[key]: return False
		return True

	def _canMove_bing(self):
		if self.row2 > self.row1: return False
		if abs(self.row1-self.row2) > 1 or abs(self.col1-self.col2) > 1: return False
		if abs(self.row1-self.row2) == 1 and abs(self.col1-self.col2) == 1: return False
		if self.row1 > 4 and not self.col2-self.col1 ==0: return False
		return True

	def _canMove_king(self):
		if self.col2 <3 or self.col2 > 5: return False
		if self.row2 < 7: return False
		abs1 = abs(self.row1-self.row2)
		abs2 = abs(self.col1-self.col2)
		if abs1 == 1 and abs2 == 0: return True
		if abs1 == 0 and abs2 == 1: return True
		return False

	def _canMove_shi(self):
		if not Math.abs(self.row1-self.row2) == 1 or not Math.abs(self.col1-self.col2) == 1:
			return False
		if self.col2 <3 or self.col2 > 5: return False
		if self.row2 < 7: return False
		return True

	def _canMove_xiang(self):
		if not abs(self.row1-self.row2) == 2 or not abs(self.col1-self.col2) == 2:
			return False
		if self.row2 < 5: return False   #相不能过河
		r0 = (self.row1+self.row2)/2
		c0 = (self.col1+self.col2)/2
		ikey = "%d-%d" % (r0,c0)
		if self.ChessPiece.PiecesMap[ikey]: return False
		return True

	def _canMove_ma(self):
		abs1 = abs(self.row1-self.row2)
		abs2 = abs(self.col1-self.col2)
		if abs1>2 or abs2>2: return False
		if abs1 == 1 and not abs2 == 2: return False
		if abs1 == 2 and not abs2 == 1: return False
		# 马角判断
		jiaokey = ''
		if abs1 == 2 and self.row2<self.row1: # 向上走
			jiaokey = "%d-%d" % (self.row1-1, self.col1)
		elif abs1 == 2 and self.row2>self.row1: # 向下走
			jiaokey = "%d-%d" % (self.row1+1,self.col1)
		elif abs2 == 2 and self.col2>self.col1: # 向右
			jiaokey = "%d-%d" % (self.row1,self.col1+1)
		else:
			jiaokey = "%d-%d" % (self.row1, self.col1-1)
		if self.ChessPiece.PiecesMap[jiaokey]: return False
		return True

	def _canMove_che(self):
		if not self.row1 == self.row2 and not self.col1 == self.col2:
			return False
		if self.row1 == self.row2:
			start = self.col2 if self.col1 > self.col2 else self.col1
			end = self.col1 if self.col1 > self.col2 else self.col2
			total = 0
			for i in range(start+1, end):
				ikey = "%d-%d" % (self.row1, i)
				if self.ChessPiece.PiecesMap[ikey]: total = total+1
			if total == 0:
				return True
			else:
				return False
		if self.col1 == self.col2:
			start = self.row2 if self.row1 > self.row2 else self.row1
			end = self.row1 if self.row1 > self.row2 else self.row2
			total = 0
			for i in range(start+1, end):
				ikey = "%d-%d" % (i, self.col1)
				if self.ChessPiece.PiecesMap[ikey]: total = total+1
			if total == 0:
				return True
			else:
				return False
		return False

	'''获取要走的棋子是什么棋'''
	def _getChessName(self):
		key = "%d-%d" % (self.row1, self.col1)
		if not self.ChessPiece.PiecesMap[key]: return ''
		chessp = self.ChessPiece.PiecesMap[key]
		return chessp.name
