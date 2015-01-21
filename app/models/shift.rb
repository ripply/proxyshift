class Shift < ActiveRecord::Base
  validates :start, presence: true
  validates :end, presence: true
  validate :start_less_than_end
  #validates :user, allow_nil: true

  scope :between, lambda {|start_time, end_time|
    {:conditions => ['? < starts < ?', Shift.format_date(start_time), Shift.format_date(end_time)] }
  }

  belongs_to :user
  # where the shift will take place
  belongs_to :category

  def self.format_date(date_time)
    Time.at(date_time.to_i).to_formatted_s(:db)
  end

  private

  def start_less_than_end
    errors.add(:start, 'should be less than end') if start > self.send(:end)
  end
end
